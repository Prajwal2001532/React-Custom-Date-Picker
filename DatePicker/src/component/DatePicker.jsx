import React, { useState } from 'react';
import '../App.css';
import { format, addMonths, addDays, setHours,addYears, setMinutes, setSeconds, subHours } from 'date-fns';

const CustomDatePicker = ({ fromDate, toDate, onDateChange }) => {
    const [startDate, setStartDate] = useState(fromDate || null);
    const [endDate, setEndDate] = useState(toDate || null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLastOptions, setShowLastOptions] = useState(false);
    const [activeInput, setActiveInput] = useState(null);

    const toggleDatePicker = (input) => {
        setShowDatePicker(!showDatePicker);
        setShowLastOptions(false);
        setActiveInput(input);
    };

    
    const toggleLastOptions = () => {
        setShowLastOptions(!showLastOptions);
        setShowDatePicker(false);
    };

    const extractMonthYear = (date) => ({
        month: date.getMonth(),
        year: date.getFullYear(),
    });

    //Select Calender Date
    const selectDate = (date) => {
        const { month, year } = extractMonthYear(date);
        if (activeInput === 'from') {
            setStartDate(new Date(year, month, date.getDate()));
            setEndDate(null);
        } else if (activeInput === 'to') {
            if (!startDate || (endDate && date >= startDate && date <= endDate)) {
                setStartDate(date);
                setEndDate(null);
            } else if (!endDate || date <= endDate) {
                setEndDate(date);
            }
        }

        if (onDateChange) {
            onDateChange(startDate, endDate);
        }
    };

    //Month Function
    const changeMonth = (amount) => {
        if (activeInput === 'from') {
            setStartDate((prevStartDate) => addMonths(prevStartDate || new Date(), amount));
        } else if (activeInput === 'to') {
            setEndDate((prevEndDate) => addMonths(prevEndDate || new Date(), amount));
        }
    };

    
     const changeYear = (amount) => {
        if (activeInput === 'from') {
            setStartDate((prevStartDate) => addYears(prevStartDate || new Date(), amount));
        } else if (activeInput === 'to') {
            setEndDate((prevEndDate) => addYears(prevEndDate || new Date(), amount));
        }
    };

    
    const changeDoubleYear = (amount) => {
        if (activeInput === 'from') {
            setStartDate((prevStartDate) => addYears(prevStartDate || new Date(), amount * 2));
        } else if (activeInput === 'to') {
            setEndDate((prevEndDate) => addYears(prevEndDate || new Date(), amount * 2));
        }
    };



  //Show Last Functionality  
  const setLastOptions = (hours) => {
    const now = new Date();
    const lastFromDate = setHours(setMinutes(setSeconds(now, 0), 0), 0);
    const lastToDate = now;

    setStartDate(subHours(lastFromDate, hours));
    setEndDate(lastToDate);

    if (onDateChange) {
      onDateChange(subHours(lastFromDate, hours), lastToDate);
    }
  };



  //Render User Date Selection
  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    let currentDate = startDate || new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const startDateFormatted = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const endDateFormatted = endDate ? format(endDate, 'yyyy-MM-dd') : null;

    if (!startDate && !endDate) {
      currentDate = new Date();
      setStartDate(currentDate);
    }

    return (
      <div className="date-picker">
        <div className="header">
          <span className="nav-button" onClick={() => changeYear(-1)}>
            &lt;&lt;
          </span>
          <span className="nav-button" onClick={() => changeMonth(-1)}>
            &lt;
          </span>
          <span className="month-year" onClick={() => toggleDatePicker(activeInput)}>
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <span className="nav-button" onClick={() => changeMonth(1)}>
            &gt;
          </span>
          <span className="nav-button" onClick={() => changeYear(1)}>
            &gt;&gt;
          </span>
        </div>
        <div className="days">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i}>{format(addDays(currentDate, i - currentDate.getDay()), 'EE')}</div>
          ))}
        </div>
        <div className="dates">
          {Array.from({ length: 35 }, (_, i) => {
            const day = addDays(currentDate, i - currentDate.getDay());
            const { month, year } = extractMonthYear(day);
            const isInRange =
              startDate &&
              endDate &&
              day >= startDate &&
              day <= endDate &&
              month === currentMonth &&
              year === currentYear;
            const isStartDate = startDate && format(day, 'yyyy-MM-dd') === startDateFormatted;
            const isEndDate = endDate && format(day, 'yyyy-MM-dd') === endDateFormatted;

            return (
              <div
                key={i}
                className={`date ${isInRange ? 'in-range' : ''} ${isStartDate ? 'start-date' : ''} ${isEndDate ? 'end-date' : ''}`}
                onClick={() => selectDate(day)}
                onMouseOver={() => highlightRange(day)}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        <br/>
        <div className="last-options">
          <span>ShowLast</span>
          <span onClick={() => setLastOptions(6)}>6h</span>
          <span onClick={() => setLastOptions(24)}>24h</span>
          <span onClick={() => setLastOptions(3 * 24)}>3d</span>
          <span onClick={() => setLastOptions(7 * 24)}>1w</span>
          <span onClick={() => setLastOptions(30 * 24)}>1m</span>
        </div>
      </div>
    );
  };

  //Highlighting the dates between the range
  const highlightRange = (date) => {
    if (startDate && endDate && date >= startDate && date <= endDate) {
        const highlightedDates = document.querySelectorAll('.date');
        highlightedDates.forEach((dateElement) => {
            const currentDate = new Date(dateElement.getAttribute('data-date'));
            if (currentDate >= startDate && currentDate <= endDate) {
                dateElement.classList.add('in-range');
            } else {
                dateElement.classList.remove('in-range');
            }
        });
    }
};



  return (
    <div className="outer">
      <div className="label">
        <p onClick={() => toggleDatePicker('from')}>From&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;</p>
        <p onClick={() => toggleDatePicker('to')}>To</p>
      </div>
      <div className="datetime-container">
        <input
          type="text"
          className="datetime-input"
          placeholder="dd/MM/yyyy | HH:mm"
          value={startDate ? format(startDate, 'dd/MM/yyyy HH:mm') : ''}
          readOnly
          onClick={() => toggleDatePicker('from')}
        />
        <input
          type="text"
          className="datetime-input"
          placeholder="dd/MM/yyyy | HH:mm"
          value={endDate ? format(endDate, 'dd/MM/yyyy HH:mm') : ''}
          readOnly
          onClick={() => toggleDatePicker('to')}
        />
        <br />
        <br />
        {renderDatePicker()}
      </div>
    </div>
  );
};

export default CustomDatePicker;
