import type {VehicleStatus as V} from "../vehicleTypes";

export function VehicleStatus({value}: { value: V }) {
    return <span className={`vehicle-status ${value.toLowerCase().replace(/ /g, '-')}`}>{value}</span>
}
