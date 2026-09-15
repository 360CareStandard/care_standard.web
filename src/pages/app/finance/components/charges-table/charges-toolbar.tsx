import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChargesToolbarProps {
  client: string;
  status: string;
  rateType: string;
  onClientChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRateTypeChange: (value: string) => void;
}

const ChargesToolbar = ({ status, onStatusChange }: ChargesToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* <Select value={client} onValueChange={onClientChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Clients" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          clients will go here
        </SelectContent>
      </Select> */}

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="unbilled">Unbilled</SelectItem>
          <SelectItem value="billed">Billed</SelectItem>
        </SelectContent>
      </Select>

      {/* <Select value={rateType} onValueChange={onRateTypeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Rate Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Rate Types</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="live-in">Live In</SelectItem>
          <SelectItem value="night">Night</SelectItem>
          <SelectItem value="weekend">Weekend</SelectItem>
          <SelectItem value="holiday">Holiday</SelectItem>
        </SelectContent>
      </Select> */}
    </div>
  );
};

export default ChargesToolbar;
