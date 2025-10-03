// @ts-ignore
import moment from "moment-jalaali";

// Configure moment-jalaali
if (typeof moment.loadPersian === 'function') {
    moment.loadPersian({ dialect: 'persian-modern' });
}

export interface PersianDate {
    year: number;
    month: number; // 0-11 (Farvardin = 0, Esfand = 11)
    day: number;
}

export class PersianDateUtils {
    // Persian month names
    static monthNames = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];

    // Persian day names (starting from Saturday)
    static dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    static shortDayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

    /**
     * Convert Gregorian date to Persian date
     */
    static gregorianToPersian(date: Date): PersianDate {
        try {
            const persianMoment = moment(date);
            return {
                year: persianMoment.jYear(),
                month: persianMoment.jMonth(),
                day: persianMoment.jDate()
            };
        } catch (error) {
            // Fallback to current date
            const now = moment();
            return {
                year: now.jYear(),
                month: now.jMonth(),
                day: now.jDate()
            };
        }
    }

    /**
     * Convert Persian date to Gregorian date
     */
    static persianToGregorian(persian: PersianDate): Date {
        try {
            return moment.from(persian.year, persian.month, persian.day, 'YYYY/MM/DD').toDate();
        } catch (error) {
            // Fallback to current date
            return new Date();
        }
    }

    /**
     * Format Persian date as string
     */
    static formatPersianDate(date: Date, format: 'short' | 'long' = 'long'): string {
        try {
            const persian = this.gregorianToPersian(date);
            const monthName = this.monthNames[persian.month];
            
            if (format === 'short') {
                return `${persian.day}/${persian.month + 1}/${persian.year}`;
            }
            
            return `${persian.day} ${monthName} ${persian.year}`;
        } catch (error) {
            // Fallback to browser's Persian locale
            return date.toLocaleDateString('fa-IR');
        }
    }

    /**
     * Get Persian day name for a given date
     */
    static getPersianDayName(date: Date, short: boolean = true): string {
        const dayIndex = (date.getDay() + 1) % 7; // Adjust for Persian week starting Saturday
        return short ? this.shortDayNames[dayIndex] : this.dayNames[dayIndex];
    }

    /**
     * Check if a year is leap in Persian calendar
     */
    static isPersianLeapYear(year: number): boolean {
        try {
            return moment.jIsLeapYear(year);
        } catch (error) {
            // Simple approximation for leap year
            const cycle = year % 128;
            return cycle === 1 || cycle === 5 || cycle === 9 || cycle === 13 || 
                   cycle === 17 || cycle === 22 || cycle === 26 || cycle === 30;
        }
    }
}