import React, { useState, useRef, useEffect } from 'react';


const Test = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDOB, setSelectedDOB] = useState(null); 
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const datePickerRef = useRef(null);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 80 }, (_, i) => 2024 - i);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const generateCalendar = () => {
        const today = new Date();
        const currentYear = selectedYear || today.getFullYear();
        const currentMonth = selectedMonth !== null ? selectedMonth : today.getMonth();
        const daysInPrevMonth = daysInMonth(currentYear, currentMonth - 1);
        const daysInCurrentMonth = daysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        const calendar = [];
        let dayCount = 1;

        for (let i = daysInPrevMonth - firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
            calendar.push(<div key={`prev${i}`} className="inactive">{i}</div>);
        }

        for (let i = 1; i <= daysInCurrentMonth; i++) {
            calendar.push(
                <div
                    key={`current${i}`}
                    className={`${
                        selectedDate && selectedDate.getDate() === i ? 'selected' : ''
                    }`}
                    onClick={() => handleDateClick(i)}
                >
                    {i}
                </div>
            );
            dayCount = i + 1;
        }

        // Remaining days
        for (let i = dayCount; i <= 42; i++) {
            calendar.push(<div key={`next${i}`} className="inactive">{i - dayCount + 1}</div>);
        }

        return calendar;
    };

    // const handleDateClick = (day) => {
    //     const today = new Date();
    //     setSelectedDate(new Date(selectedYear || today.getFullYear(), selectedMonth !== null ? selectedMonth : today.getMonth(), day));
    //     setIsDatePickerOpen(false);
    // };

    const handleDateClick = (day) => {
        const today = new Date();
        const newDate = new Date(
            selectedYear || today.getFullYear(),
            selectedMonth !== null ? selectedMonth : today.getMonth(),
            day
        );
    
        setSelectedDate(newDate);
        setSelectedDOB(newDate);
        setIsDatePickerOpen(false);
        console.log('Selected Date of Birth:', newDate);
    };
    

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
    };

    const handleClickOutside = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
            setIsDatePickerOpen(false);
        }
    };

    const handleInputMouseDown = (e) => {
        e.preventDefault(); 
    };

    const handleInputClick = () => {
        toggleDatePicker(); 
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-calendar" ref={datePickerRef}>
            <div className="date-input-container">
                <input
                    type="text"
                    value={selectedDate ? selectedDate.toLocaleDateString('en-GB') : ''}
                    onMouseDown={handleInputMouseDown}
                    onClick={handleInputClick} 
                    readOnly
                />
            </div>
            {isDatePickerOpen && (
                <div className="date-picker">
                    <div className="calendar-header">
                        <div className="dropdown">
                            <select
                                value={selectedMonth !== null ? selectedMonth : ''}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            >
                                <option value="" disabled>Select Month</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdown">
                            <select
                                value={selectedYear || ''}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            >
                                <option value="" disabled>Select Year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="calendar-days">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="calendar-grid">{generateCalendar()}</div>
                </div>
            )}
        </div>
    );
};

export default Test;
