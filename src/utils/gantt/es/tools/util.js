export function throttle(func, delay) {
    let timer = null;
    return function(...args) {
        timer || (func.apply(this, args), timer = setTimeout((() => {
            timer = null;
        }), delay));
    };
}

export function throttle2(func, delay) {
    let timer = null;
    return function(...args) {
        timer || (timer = setTimeout((() => {
            func.apply(this, args), timer = null;
        }), delay));
    };
}

export function getTodayNearDay(dayOffset, format) {
    const todayTime = (new Date).getTime(), date = new Date(todayTime + 864e5 * dayOffset);
    if (format) {
        const year = date.getFullYear().toString(), month = (date.getMonth() + 1).toString().padStart(2, "0"), day = date.getDate().toString().padStart(2, "0");
        return format = (format = (format = format.replace("yyyy", year)).replace("mm", month)).replace("dd", day);
    }
    return date;
}

export function formatDate(date, format) {
    const year = date.getFullYear().toString(), month = (date.getMonth() + 1).toString().padStart(2, "0"), day = date.getDate().toString().padStart(2, "0");
    if ((format = (format = (format = format.replace("yyyy", year)).replace("mm", month)).replace("dd", day)).length > 10) {
        const hour = date.getHours().toString().padStart(2, "0"), minute = date.getMinutes().toString().padStart(2, "0"), second = date.getSeconds().toString().padStart(2, "0");
        format = (format = (format = format.replace("hh", hour)).replace("mm", minute)).replace("ss", second);
    }
    return format;
}

function validateDate(dateParts, format) {
    const yearIndex = format.indexOf("yyyy"), monthIndex = format.indexOf("mm"), dayIndex = format.indexOf("dd"), dateMonthIndex = monthIndex < yearIndex ? monthIndex < dayIndex ? 0 : 1 : monthIndex < dayIndex ? 1 : 2, dateDayIndex = dayIndex < yearIndex ? dayIndex < monthIndex ? 0 : 1 : dayIndex < monthIndex ? 1 : 2, year = parseInt(dateParts[yearIndex < monthIndex ? yearIndex < dayIndex ? 0 : 1 : monthIndex < dayIndex ? 1 : 2], 10), month = parseInt(dateParts[dateMonthIndex], 10) - 1, day = parseInt(dateParts[dateDayIndex], 10);
    if (isNaN(year) || year < 1) return !1;
    if (isNaN(month) || month < 0 || month > 11) return !1;
    const daysInMonth = [ 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    return !(isNaN(day) || day < 1 || day > daysInMonth[month]);
}

function validateTime(dateParts, format) {
    if (format.includes("hh") || format.includes("mm") || format.includes("ss")) {
        const timeIndex = format.indexOf("hh") > -1 ? format.indexOf("hh") : format.indexOf("HH"), hour = parseInt(dateParts[timeIndex], 10), minute = parseInt(dateParts[timeIndex + 1], 10), second = dateParts.length > timeIndex + 2 ? parseInt(dateParts[timeIndex + 2], 10) : 0;
        if (isNaN(hour) || hour < 0 || hour > 23) return !1;
        if (isNaN(minute) || minute < 0 || minute > 59) return !1;
        if (isNaN(second) || second < 0 || second > 59) return !1;
    }
    return !0;
}

function isLeapYear(year) {
    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
}

export function parseDateFormat(dateString) {
    const formats = [ "yyyy-mm-dd", "dd-mm-yyyy", "mm/dd/yyyy", "yyyy/mm/dd", "dd/mm/yyyy", "yyyy.mm.dd", "mm.dd.yyyy", "dd.mm.yyyy" ], timeFormat = [ "hh:mm:ss", "hh:mm" ], dates = (dateString = dateString.trim()).split(" "), date = dates[0], time = dates[1];
    let dateFormatMatched, timeFormatMatched;
    if (date) for (let i = 0; i < formats.length; i++) {
        const format = formats[i], dateParts = date.split(getSeparator(format)), isValid = validateDate(dateParts, format);
        if (3 === dateParts.length && isValid) {
            dateFormatMatched = format;
            break;
        }
    }
    if (dateFormatMatched && time) for (let i = 0; i < timeFormat.length; i++) {
        const format = timeFormat[i], timeParts = time.split(getSeparator(format)), formatParts = format.split(getSeparator(format));
        if (validateTime(timeParts, format) && timeParts.length === formatParts.length) {
            timeFormatMatched = format;
            break;
        }
    }
    return date && time && dateFormatMatched && timeFormatMatched ? dateFormatMatched + " " + timeFormatMatched : date && !time ? dateFormatMatched : "yyyy-mm-dd hh:mm:ss";
}

function getSeparator(format) {
    const separators = format.match(/[^\w]/g);
    if (separators) {
        const escapedSeparators = separators.map((s => "\\" + s)).join("|");
        return new RegExp(escapedSeparators, "g");
    }
    return /[^\w]/;
}

export function parseStringTemplate(template, data) {
    return template.replace(/\{([^}]+)\}/g, ((match, key) => {
        const keys = key.split(".");
        let value = data;
        for (const k of keys) {
            if (!value.hasOwnProperty(k)) {
                value = match;
                break;
            }
            value = value[k];
        }
        return value;
    }));
}

export function toBoxArray(obj) {
    return Array.isArray(obj) ? 3 === obj.length ? [ obj[0], obj[1], obj[2], obj[1] ] : 2 === obj.length ? [ obj[0], obj[1], obj[0], obj[1] ] : 1 === obj.length ? [ obj[0], obj[0], obj[0], obj[0] ] : [ obj[0], obj[1], obj[2], obj[3] ] : [ obj, obj, obj, obj ];
}

export function getWeekNumber(currentDate) {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    return Math.ceil(((currentDate.getTime() + 1 - startOfYear.getTime()) / 864e5 + 1) / 7);
}

export function getWeekday(dateString, format = "long") {
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], date = new Date(dateString);
    return "short" === format ? days[date.getDay()].substr(0, 3) : "long" === format ? days[date.getDay()] : 'Invalid format specified. Please use "short" or "long".';
}

export function isPropertyWritable(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    return !!descriptor && (!!descriptor.set || !0 === descriptor.writable);
}

export function createDateAtMidnight(dateStr, forceMidnight = !1) {
    let date;
    if (dateStr) {
        if (date = new Date(dateStr), "string" == typeof dateStr) {
            if (dateStr.length > 10) return forceMidnight && date.setHours(0, 0, 0, 0), date;
            date.setHours(0, 0, 0, 0);
        }
    } else date = new Date;
    return forceMidnight && date.setHours(0, 0, 0, 0), date;
}

export function createDateAtLastMinute(dateStr, forceSetMinute = !1) {
    let date;
    if (dateStr) {
        if (date = new Date(dateStr), "string" == typeof dateStr) {
            if (dateStr.length > 10) return forceSetMinute && date.setMinutes(59, 59, 999), 
            date;
            date.setMinutes(59, 59, 999);
        }
    } else date = new Date;
    return forceSetMinute && date.setMinutes(59, 59, 999), date;
}

export function createDateAtLastSecond(dateStr, forceSetSecond = !1) {
    let date;
    if (dateStr) {
        if (date = new Date(dateStr), "string" == typeof dateStr) {
            if (dateStr.length > 10) return forceSetSecond && date.setSeconds(59, 999), date;
            date.setSeconds(59, 999);
        }
    } else date = new Date;
    return forceSetSecond && date.setSeconds(59, 999), date;
}

export function createDateAtLastMillisecond(dateStr, forceSetMillisecond = !1) {
    let date;
    if (dateStr) {
        if (date = new Date(dateStr), "string" == typeof dateStr) {
            if (dateStr.length > 10) return forceSetMillisecond && date.setMilliseconds(999), 
            date;
            date.setMilliseconds(999);
        }
    } else date = new Date;
    return forceSetMillisecond && date.setMilliseconds(999), date;
}

export function createDateAtLastHour(dateStr, forceLastHour = !1) {
    let date;
    if (dateStr) {
        if (date = new Date(dateStr), "string" == typeof dateStr) {
            if (dateStr.length > 10) return forceLastHour && date.setHours(23, 59, 59, 999), 
            date;
            date.setHours(23, 59, 59, 999);
        }
    } else date = new Date;
    return forceLastHour && date.setHours(23, 59, 59, 999), date;
}

export function getEndDateByTimeUnit(startDate, date, timeScale, step) {
    let endDate = new Date(date);
    switch (timeScale) {
      case "second":
        endDate.setMilliseconds(999);
        break;

      case "minute":
        endDate.setSeconds(59, 999);
        break;

      case "hour":
        endDate.setMinutes(59, 59, 999);
        break;

      case "day":
        endDate.setHours(23, 59, 59, 999);
        break;

      case "week":
        const diffToEndOfWeek = 6 - endDate.getDay();
        endDate.setDate(endDate.getDate() + diffToEndOfWeek), endDate.setHours(23, 59, 59, 999);
        break;

      case "month":
        const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
        endDate.setDate(lastDayOfMonth), endDate.setHours(23, 59, 59, 999);
        break;

      case "quarter":
        const currentMonth = endDate.getMonth(), endMonthOfQuarter = currentMonth - currentMonth % 3 + 2, lastDayOfQuarter = new Date(endDate.getFullYear(), endMonthOfQuarter + 1, 0).getDate();
        endDate.setMonth(endMonthOfQuarter, lastDayOfQuarter), endDate.setHours(23, 59, 59, 999);
        break;

      case "year":
        endDate.setMonth(11, 31), endDate.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error("Invalid time scale");
    }
    const count = computeCountToTimeScale(endDate, startDate, timeScale, step, 1), targetCount = Math.ceil(count);
    if (targetCount > count) {
        const dif = (targetCount - count) * step, msInSecond = 1e3, msInMinute = 60 * msInSecond, msInHour = 60 * msInMinute, msInDay = 24 * msInHour, msInWeek = 7 * msInDay;
        new Date(endDate.getTime() + 1);
        switch (timeScale) {
          case "second":
            endDate.setTime(endDate.getTime() + dif * msInSecond);
            break;

          case "minute":
            endDate.setTime(endDate.getTime() + dif * msInMinute);
            break;

          case "hour":
            endDate.setTime(endDate.getTime() + dif * msInHour);
            break;

          case "day":
            endDate.setTime(endDate.getTime() + dif * msInDay);
            break;

          case "week":
            endDate.setTime(endDate.getTime() + dif * msInWeek);
            break;

          case "month":
            endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1 + Math.round(dif), 0), 
            endDate.setHours(23, 59, 59, 999);
            break;

          case "quarter":
            const currentMonth = endDate.getMonth(), endMonthOfQuarter = currentMonth - currentMonth % 3 + 2;
            endDate = new Date(endDate.getFullYear(), endMonthOfQuarter + Math.round(3 * dif) + 1, 0), 
            endDate.setHours(23, 59, 59, 999);
            break;

          case "year":
            endDate.setFullYear(endDate.getFullYear() + Math.floor(dif)), endDate.setHours(23, 59, 59, 999);
            break;

          default:
            throw new Error("Invalid time scale");
        }
    }
    return endDate;
}

export function getStartDateByTimeUnit(date, timeScale, startOfWeekSetting = "monday") {
    const startDate = new Date(date);
    switch (timeScale) {
      case "second":
        startDate.setMilliseconds(0);
        break;

      case "minute":
        startDate.setSeconds(0, 0);
        break;

      case "hour":
        startDate.setMinutes(0, 0, 0);
        break;

      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;

      case "week":
        const day = startDate.getDay();
        let diffToStartOfWeek = day;
        diffToStartOfWeek = "monday" === startOfWeekSetting ? 0 === day ? -6 : 1 - day : -day, 
        startDate.setDate(startDate.getDate() + diffToStartOfWeek), startDate.setHours(0, 0, 0, 0);
        break;

      case "month":
        startDate.setDate(1), startDate.setHours(0, 0, 0, 0);
        break;

      case "quarter":
        const currentMonth = startDate.getMonth(), startMonthOfQuarter = currentMonth - currentMonth % 3;
        startDate.setMonth(startMonthOfQuarter, 1), startDate.setHours(0, 0, 0, 0);
        break;

      case "year":
        startDate.setMonth(0, 1), startDate.setHours(0, 0, 0, 0);
        break;

      default:
        throw new Error("Invalid time scale");
    }
    return startDate;
}

export function computeCountToTimeScale(date, startDate, timeScale, step, diffMS = 0) {
    let difference;
    const adjusted_date = new Date(date.getTime() + diffMS);
    switch (timeScale) {
      case "second":
        difference = (adjusted_date.getTime() - startDate.getTime()) / 1e3;
        break;

      case "minute":
        difference = (adjusted_date.getTime() - startDate.getTime()) / 6e4;
        break;

      case "hour":
        difference = (adjusted_date.getTime() - startDate.getTime()) / 36e5;
        break;

      case "day":
        difference = (adjusted_date.getTime() - startDate.getTime()) / 864e5;
        break;

      case "week":
        difference = (adjusted_date.getTime() - startDate.getTime()) / 6048e5;
        break;

      case "month":
        const startDaysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate(), adjustedDaysInMonth = new Date(adjusted_date.getFullYear(), adjusted_date.getMonth() + 1, 0).getDate();
        difference = 12 * (adjusted_date.getFullYear() - startDate.getFullYear()) + (adjusted_date.getMonth() - startDate.getMonth()), 
        difference += adjusted_date.getDate() / adjustedDaysInMonth - startDate.getDate() / startDaysInMonth;
        break;

      case "quarter":
        difference = 4 * (adjusted_date.getFullYear() - startDate.getFullYear()) + (adjusted_date.getMonth() - startDate.getMonth()) / 3, 
        difference += (adjusted_date.getDate() - startDate.getDate()) / (3 * new Date(adjusted_date.getFullYear(), adjusted_date.getMonth() + 1, 0).getDate());
        break;

      case "year":
        difference = adjusted_date.getFullYear() - startDate.getFullYear(), difference += (adjusted_date.getMonth() - startDate.getMonth()) / 12;
        break;

      default:
        throw new Error("Invalid time scale");
    }
    return difference / step;
}

export function parseDateToTimeUnit(date, timeUnit) {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    switch (timeUnit) {
      case "second":
        return date.getMilliseconds() / 1e3;

      case "minute":
        return (date.getSeconds() + date.getMilliseconds() / 1e3) / 60;

      case "hour":
        return (60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / 3600;

      case "day":
        return (60 * date.getHours() * 60 + 60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / 86400;

      case "week":
        return (24 * date.getDay() * 60 * 60 + 60 * date.getHours() * 60 + 60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / 604800;

      case "month":
        return (24 * (date.getDate() - 1) * 60 * 60 + 60 * date.getHours() * 60 + 60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / (24 * daysInMonth * 60 * 60);

      case "quarter":
        const monthInQuarter = date.getMonth() % 3, daysInQuarter = 3 * new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return (24 * (monthInQuarter * daysInMonth + date.getDate() - 1) * 60 * 60 + 60 * date.getHours() * 60 + 60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / (24 * daysInQuarter * 60 * 60);

      case "year":
        const daysInYear = isLeapYear(date.getFullYear()) ? 366 : 365;
        return (24 * (date.getMonth() * daysInMonth + date.getDate() - 1) * 60 * 60 + 60 * date.getHours() * 60 + 60 * date.getMinutes() + date.getSeconds() + date.getMilliseconds() / 1e3) / (24 * daysInYear * 60 * 60);

      default:
        throw new Error("Invalid time unit");
    }
}
//# sourceMappingURL=util.js.map