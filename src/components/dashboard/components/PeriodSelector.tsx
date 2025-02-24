
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodType } from "../utils/dateUtils";

interface PeriodSelectorProps {
  periodType: PeriodType;
  selectedYear: string;
  selectedMonth: string;
  selectedQuarter: string;
  setPeriodType: (value: PeriodType) => void;
  setSelectedYear: (value: string) => void;
  setSelectedMonth: (value: string) => void;
  setSelectedQuarter: (value: string) => void;
}

const PeriodSelector = ({
  periodType,
  selectedYear,
  selectedMonth,
  selectedQuarter,
  setPeriodType,
  setSelectedYear,
  setSelectedMonth,
  setSelectedQuarter,
}: PeriodSelectorProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 11 },
    (_, i) => (currentYear - 10 + i).toString()
  );
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">
          Select Period Type
        </label>
        <Select
          value={periodType}
          onValueChange={(value) => setPeriodType(value as PeriodType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select period type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
            <SelectItem value="decade">Decade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">
          Select Year
        </label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {periodType === 'month' && (
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Select Month
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {periodType === 'quarter' && (
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Select Quarter
          </label>
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger>
              <SelectValue placeholder="Select quarter" />
            </SelectTrigger>
            <SelectContent>
              {quarters.map((quarter, index) => (
                <SelectItem key={quarter} value={index.toString()}>
                  {quarter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
