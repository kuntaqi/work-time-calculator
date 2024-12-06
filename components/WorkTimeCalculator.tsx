'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'

interface Break {
  start: string
  end: string
}

export default function WorkTimeCalculator() {
  const [weeklyTarget, setWeeklyTarget] = useState(45)
  const [timeWorked, setTimeWorked] = useState('00:00:00')
  const [breaks, setBreaks] = useState<Break[]>([{ start: '', end: '' }])
  const [startTime, setStartTime] = useState('')
  const [remainingTime, setRemainingTime] = useState({ hours: 40, minutes: 0, seconds: 0 })
  const [goHomeTime, setGoHomeTime] = useState('')
  const [overtime, setOvertime] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    calculateRemainingTime()
  }, [weeklyTarget, timeWorked, breaks])

  useEffect(() => {
    if (startTime) {
      calculateGoHomeTime()
    }
  }, [startTime, remainingTime])

  const calculateRemainingTime = () => {
    const [hours, minutes, seconds] = timeWorked.split(':').map(Number)
    const totalWorkedSeconds = (hours * 3600) + (minutes * 60) + seconds

    let totalBreakSeconds = 0
    breaks.forEach(breakItem => {
      if (breakItem.start && breakItem.end) {
        const [startHours, startMinutes, startSeconds] = breakItem.start.split(':').map(Number)
        const [endHours, endMinutes, endSeconds] = breakItem.end.split(':').map(Number)
        const startTotalSeconds = (startHours * 3600) + (startMinutes * 60) + startSeconds
        const endTotalSeconds = (endHours * 3600) + (endMinutes * 60) + endSeconds
        const breakSeconds = endTotalSeconds >= startTotalSeconds 
          ? endTotalSeconds - startTotalSeconds
          : (24 * 3600 - startTotalSeconds) + endTotalSeconds
        totalBreakSeconds += breakSeconds
      }
    })

    const adjustedWorkedSeconds = Math.max(totalWorkedSeconds - totalBreakSeconds, 0)
    const targetSeconds = weeklyTarget * 3600

    let remainingSeconds = Math.max(targetSeconds - adjustedWorkedSeconds, 0)
    let overtimeSeconds = Math.max(adjustedWorkedSeconds - targetSeconds, 0)

    setRemainingTime({
      hours: Math.floor(remainingSeconds / 3600),
      minutes: Math.floor((remainingSeconds % 3600) / 60),
      seconds: remainingSeconds % 60
    })

    setOvertime({
      hours: Math.floor(overtimeSeconds / 3600),
      minutes: Math.floor((overtimeSeconds % 3600) / 60),
      seconds: overtimeSeconds % 60
    })
  }

  const calculateGoHomeTime = () => {
    const [hours, minutes, seconds] = startTime.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, seconds)
    const endDate = new Date(startDate.getTime() + (remainingTime.hours * 3600000) + (remainingTime.minutes * 60000) + (remainingTime.seconds * 1000))
    setGoHomeTime(endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

  const formatTime = (time: { hours: number, minutes: number, seconds: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`
  }

  const addBreak = () => {
    setBreaks([...breaks, { start: '', end: '' }])
  }

  const removeBreak = (index: number) => {
    setBreaks(breaks.filter((_, i) => i !== index))
  }

  const updateBreak = (index: number, field: 'start' | 'end', value: string) => {
    const newBreaks = [...breaks]
    newBreaks[index][field] = value
    setBreaks(newBreaks)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Calculate Your Work Time</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weeklyTarget">Weekly Target Hours</Label>
          <Input
            id="weeklyTarget"
            type="number"
            value={weeklyTarget}
            onChange={(e) => setWeeklyTarget(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeWorked">Time Worked This Week (HH:MM:SS)</Label>
          <Input
            id="timeWorked"
            type="text"
            value={timeWorked}
            onChange={(e) => setTimeWorked(e.target.value)}
            placeholder="00:00:00"
          />
        </div>
        <div className="space-y-2">
          <Label>Breaks</Label>
          {breaks.map((breakItem, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <Input
                type="text"
                value={breakItem.start}
                onChange={(e) => updateBreak(index, 'start', e.target.value)}
                placeholder="Start (HH:MM:SS)"
              />
              <Input
                type="text"
                value={breakItem.end}
                onChange={(e) => updateBreak(index, 'end', e.target.value)}
                placeholder="End (HH:MM:SS)"
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBreak(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addBreak} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Break
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Today's Start Time (HH:MM:SS, 24-hour format)</Label>
          <Input
            id="startTime"
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="00:00:00"
          />
          <p className="text-sm text-gray-500">Enter time in 24-hour format (e.g., 09:00:00 for 9 AM, 13:30:45 for 1:30:45 PM)</p>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-lg font-semibold">Remaining Time: {formatTime(remainingTime)}</p>
          {goHomeTime && <p className="text-lg font-semibold">Go Home Time: {goHomeTime}</p>}
          {(overtime.hours > 0 || overtime.minutes > 0 || overtime.seconds > 0) && (
            <p className="text-lg font-semibold text-green-600">Overtime: {formatTime(overtime)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
