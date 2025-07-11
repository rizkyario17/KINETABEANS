
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Download, Settings, Clock, User, CalendarDays, Pencil, Info, LogOut, LogIn, Calendar as CalendarIcon, PieChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format, differenceInMinutes, startOfMonth, getDaysInMonth, isSameDay } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

type AttendanceStatus = "On Time" | "Late" | "Absent" | "Sick" | "Permission";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  clockInTime: string | null; // HH:mm
  clockOutTime: string | null; // HH:mm
  overtime: string; // e.g. "1h 30m"
  status: AttendanceStatus;
  notes: string;
}

const initialEmployees: any[] = [];
const initialAttendance: AttendanceRecord[] = [];


const getStatusBadgeVariant = (status: AttendanceStatus) => {
  switch (status) {
    case 'On Time': return 'bg-green-100 text-green-800 border-green-200';
    case 'Late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
    case 'Sick':
    case 'Permission':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'outline';
  }
};

const getStatusColorClass = (status: AttendanceStatus) => {
    switch (status) {
      case 'On Time': return 'bg-green-500 text-white rounded-md';
      case 'Late': return 'bg-yellow-500 text-white rounded-md';
      case 'Absent': return 'bg-red-500 text-white rounded-md';
      case 'Sick': return 'bg-blue-500 text-white rounded-md';
      case 'Permission': return 'bg-indigo-500 text-white rounded-md';
      default: return '';
    }
  };


const convertToCSV = (data: AttendanceRecord[]) => {
    const headers = ["Date", "Employee ID", "Employee Name", "Clock In", "Clock Out", "Overtime", "Status", "Notes"];
    const headerRow = headers.join(',');
    const bodyRows = data.map(row => 
        [
            row.date,
            row.employeeId,
            `"${row.employeeName}"`,
            row.clockInTime || 'N/A',
            row.clockOutTime || 'N/A',
            row.overtime || 'N/A',
            row.status,
            `"${row.notes.replace(/"/g, '""')}"`
        ].join(',')
    ).join('\n');
    return `${headerRow}\n${bodyRows}`;
};

interface DailyAttendanceState {
    clockInTime: string | null;
    clockOutTime: string | null;
    statusMessage: string | null;
}

export default function AttendancePage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(initialAttendance);
  const [lateTolerance, setLateTolerance] = useState(60); // in minutes
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendanceState>({ clockInTime: null, clockOutTime: null, statusMessage: null });
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>(initialEmployees[0]?.id);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    const today = format(new Date(), 'yyyy-MM-dd');
    const storedAttendance = localStorage.getItem(`attendance_${today}`);
    if (storedAttendance) {
        setDailyAttendance(JSON.parse(storedAttendance));
    }
  }, []);

  const { calendarModifiers, calendarSummary } = useMemo(() => {
    const employeeRecords = attendanceData.filter(
        rec => rec.employeeId === selectedEmployee && 
               new Date(rec.date).getMonth() === currentMonth.getMonth() &&
               new Date(rec.date).getFullYear() === currentMonth.getFullYear()
    );

    const modifiers: Record<string, Date[]> = {
        'on-time': [],
        'late': [],
        'absent': [],
        'sick': [],
        'permission': [],
    };
    
    const summary: Record<AttendanceStatus, number> = {
        "On Time": 0, "Late": 0, "Absent": 0, "Sick": 0, "Permission": 0
    };

    employeeRecords.forEach(rec => {
      const date = new Date(rec.date.replace(/-/g, '/'));
      summary[rec.status]++;
      switch (rec.status) {
        case 'On Time': modifiers['on-time'].push(date); break;
        case 'Late': modifiers['late'].push(date); break;
        case 'Absent': modifiers['absent'].push(date); break;
        case 'Sick': modifiers['sick'].push(date); break;
        case 'Permission': modifiers['permission'].push(date); break;
      }
    });

    return { calendarModifiers: modifiers, calendarSummary: summary };
  }, [selectedEmployee, currentMonth, attendanceData]);
  
  const calculateOvertime = (clockOutTime: string): string => {
    const now = new Date();
    const clockOutDate = new Date(`${format(now, 'yyyy-MM-dd')}T${clockOutTime}`);
    const endWorkDate = new Date(`${format(now, 'yyyy-MM-dd')}T18:00:00`);

    if (clockOutDate <= endWorkDate) {
        return '0h 0m';
    }

    const diff = differenceInMinutes(clockOutDate, endWorkDate);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleClockIn = () => {
    const now = new Date();
    const clockInTime = format(now, 'HH:mm');
    const today = format(now, 'yyyy-MM-dd');
    const entryTime = now.getHours() * 60 + now.getMinutes();
    const startTime = 8 * 60; // 08:00
    
    let status: AttendanceStatus;
    let statusMessage: string;

    if (entryTime <= startTime + lateTolerance) {
        status = "On Time";
        statusMessage = `You clocked in at ${clockInTime}. Status: On Time.`;
    } else {
        status = "Late";
        statusMessage = `You clocked in at ${clockInTime}. Status: Late.`;
    }

    const newDailyState = { clockInTime, clockOutTime: null, statusMessage };
    localStorage.setItem(`attendance_${today}`, JSON.stringify(newDailyState));
    setDailyAttendance(newDailyState);

    toast({
        title: "Clock-in Successful!",
        description: statusMessage,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    const clockOutTime = format(now, 'HH:mm');
    const today = format(now, 'yyyy-MM-dd');
    
    const overtime = calculateOvertime(clockOutTime);
    const statusMessage = `You clocked out at ${clockOutTime}. Overtime: ${overtime}.`;

    const newDailyState = { ...dailyAttendance, clockOutTime, statusMessage };
    localStorage.setItem(`attendance_${today}`, JSON.stringify(newDailyState));
    setDailyAttendance(newDailyState);

    toast({
        title: "Clock-out Successful!",
        description: statusMessage,
    });
  };

  const handleDownload = () => {
    const csv = convertToCSV(attendanceData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRecord) return;
    
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status') as AttendanceStatus;
    const newNotes = formData.get('notes') as string;
    const newClockIn = formData.get('clockInTime') as string;
    const newClockOut = formData.get('clockOutTime') as string;
    
    const overtime = newClockOut ? calculateOvertime(newClockOut) : '';

    setAttendanceData(prev => prev.map(rec => 
        rec.id === editingRecord.id 
        ? { ...rec, 
            status: newStatus, 
            notes: newNotes, 
            clockInTime: newStatus === 'Absent' ? null : newClockIn,
            clockOutTime: newStatus === 'Absent' ? null : newClockOut,
            overtime,
          } 
        : rec
    ));
    setEditOpen(false);
    setEditingRecord(null);
    toast({ title: 'Success', description: `Attendance for ${editingRecord.employeeName} has been updated.`});
  };
  
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newTolerance = Number(formData.get('tolerance'));
      setLateTolerance(newTolerance);
      setSettingsOpen(false);
      toast({ title: 'Settings Saved', description: `Late tolerance updated to ${newTolerance} minutes.`});
  };

  const employeeView = (
    <Card className="max-w-md mx-auto">
        <CardHeader>
            <CardTitle className="text-center">Employee Attendance</CardTitle>
            <CardDescription className="text-center">Today is {format(new Date(), 'd MMMM yyyy')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
            <Clock className="w-24 h-24 text-primary" />
            {!dailyAttendance.clockInTime ? (
                <Button size="lg" onClick={handleClockIn}><LogIn className='mr-2 h-4 w-4' /> Clock In Now</Button>
            ) : !dailyAttendance.clockOutTime ? (
                <>
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="font-semibold">You have clocked in.</p>
                        <p className="text-muted-foreground">{dailyAttendance.statusMessage}</p>
                    </div>
                    <Button size="lg" onClick={handleClockOut}><LogOut className='mr-2 h-4 w-4' /> Clock Out Now</Button>
                </>
            ) : (
                 <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="font-semibold">You have completed your attendance today.</p>
                    <p className="text-muted-foreground">Clock-in: {dailyAttendance.clockInTime}, Clock-out: {dailyAttendance.clockOutTime}</p>
                     <p className="text-sm text-muted-foreground">{dailyAttendance.statusMessage}</p>
                </div>
            )}
        </CardContent>
        <CardFooter className='justify-center text-xs text-muted-foreground'>
            Work hours: 08:00 - 18:00. Late tolerance: {lateTolerance} minutes.
        </CardFooter>
    </Card>
  );

  const ownerView = (
    <Tabs defaultValue="history" className="w-full">
        <div className="flex items-center justify-between mb-4">
            <TabsList>
                <TabsTrigger value="history"><CalendarDays className="mr-2 h-4 w-4"/>Attendance History</TabsTrigger>
                <TabsTrigger value="calendar"><CalendarIcon className="mr-2 h-4 w-4"/>Calendar View</TabsTrigger>
            </TabsList>
             <div className='flex gap-2'>
                <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                        <form onSubmit={handleSaveSettings}>
                            <DialogHeader>
                                <DialogTitle>Attendance Settings</DialogTitle>
                                <DialogDescription>Manage attendance rules. Only affects future clock-ins.</DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="tolerance" className="text-right">Late Tolerance (minutes)</Label>
                                    <Input id="tolerance" name="tolerance" type="number" defaultValue={lateTolerance} className="col-span-3"/>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Settings</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Report</Button>
            </div>
        </div>

        <TabsContent value="history">
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Log</CardTitle>
                    <CardDescription>Full attendance log for all employees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead className="text-center">Clock In</TableHead>
                                <TableHead className="text-center">Clock Out</TableHead>
                                <TableHead className="text-center">Overtime</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.date.replace(/-/g, '/')), 'd MMM yyyy')}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{record.employeeName}</div>
                                        <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                                    </TableCell>
                                    <TableCell className="text-center font-mono">{record.clockInTime || '--:--'}</TableCell>
                                    <TableCell className="text-center font-mono">{record.clockOutTime || '--:--'}</TableCell>
                                    <TableCell className="text-center font-mono">{record.overtime || 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={cn("w-full max-w-[120px] mx-auto justify-center", getStatusBadgeVariant(record.status))}>
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{record.notes}</TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(record)}>
                                            <Pencil className="h-4 w-4" />
                                    </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="calendar">
            <Card>
                <CardHeader>
                    <CardTitle>Calendar Overview</CardTitle>
                    <CardDescription>Visual attendance overview for each employee.</CardDescription>
                    <div className="pt-4">
                        <Label>Select Employee</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger className="w-full md:w-[300px]">
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialEmployees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            modifiers={calendarModifiers}
                            modifiersClassNames={{
                                'on-time': 'bg-green-500 text-primary-foreground',
                                'late': 'bg-yellow-500 text-primary-foreground',
                                'absent': 'bg-red-500 text-primary-foreground',
                                'sick': 'bg-blue-500 text-primary-foreground',
                                'permission': 'bg-indigo-500 text-primary-foreground',
                            }}
                            className="rounded-md border"
                        />
                    </div>
                    <Card className="bg-muted/50">
                        <CardHeader>
                           <CardTitle className='flex items-center gap-2'><PieChart className='h-5 w-5'/> Monthly Summary</CardTitle>
                           <CardDescription>
                                {initialEmployees.find(e => e.id === selectedEmployee)?.name} - {format(currentMonth, 'MMMM yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-3'>
                                {Object.entries(calendarSummary).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", getStatusColorClass(status as AttendanceStatus))}></div>
                                            <span>{status}</span>
                                        </div>
                                        <span className="font-semibold">{count} hari</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">ATTENDANCE</h1>
            <p className="text-muted-foreground">Manage employee attendance and schedules.</p>
        </div>
      </div>
      <div className="mt-6">
        {userRole === 'owner' ? ownerView : employeeView}
      </div>

       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-md">
                {editingRecord && (
                    <form onSubmit={handleSaveEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Attendance</DialogTitle>
                            <DialogDescription>Manually override attendance status for {editingRecord.employeeName}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className='flex items-center gap-4 p-4 bg-muted rounded-lg'>
                                <Info className='h-8 w-8 text-muted-foreground'/>
                                <div>
                                    <p><strong>{editingRecord.employeeName}</strong> on <strong>{format(new Date(editingRecord.date.replace(/-/g, '/')), 'd MMMM yyyy')}</strong></p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="clockInTime" className="text-right">Clock In</Label>
                                <Input id="clockInTime" name="clockInTime" type="time" defaultValue={editingRecord.clockInTime || ''} className="col-span-3"/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="clockOutTime" className="text-right">Clock Out</Label>
                                <Input id="clockOutTime" name="clockOutTime" type="time" defaultValue={editingRecord.clockOutTime || ''} className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select name="status" defaultValue={editingRecord.status}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="On Time">On Time</SelectItem>
                                        <SelectItem value="Late">Late</SelectItem>
                                        <SelectItem value="Absent">Absent</SelectItem>
                                        <SelectItem value="Sick">Sick</SelectItem>
                                        <SelectItem value="Permission">Permission</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notes</Label>
                                <Textarea id="notes" name="notes" defaultValue={editingRecord.notes} className="col-span-3" placeholder="e.g., Doctor's note attached"/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}
