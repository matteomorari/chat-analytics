import { Platform } from "@pipeline/Types";
import { ProcessedData } from "@pipeline/preprocess/ProcessedData";

export interface AuthorOption {
    id: number;
    name: string;
    name_searchable: string;
    bot: boolean;
}

export interface ChannelOption {
    id: number;
    name: string;
    name_searchable: string;
}

export interface Basic {
    platform: Platform;
    title: string;
    minDate: string;
    maxDate: string;
    authors: AuthorOption[];
    channels: ChannelOption[];
}

export const computeBasic = (pd: ProcessedData): Basic => ({
    platform: pd.platform,
    title: pd.title,
    minDate: pd.minDate,
    maxDate: pd.maxDate,
    authors: pd.authors.map((a, i) => ({
        id: i,
        name: a.name,
        name_searchable: a.name_searchable,
        bot: a.bot,
    })),
    channels: pd.channels.map((a, i) => ({
        id: i,
        name: a.name,
        name_searchable: a.name_searchable,
    })),
});