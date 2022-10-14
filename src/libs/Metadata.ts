import { ChartMetadata } from "../components/widgets/chart/NewChartWidget";

// TODO remove this file?

// Widgets which have their own metadata to be persisted in the JSON should be added here
// The keys of AllMetadata will essentially be the IDs for the widget metadata
export type AllMetadata = {
    chart?: ChartMetadata,
}
