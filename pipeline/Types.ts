import { MessageBitConfig } from "@pipeline/report/Serialization";
import { DateKey, Day } from "@pipeline/Time";

// raw ID that comes from the platform (e.g 9876554321)
export type RawID = string | number;

// internal ID that is used in the pipeline (incremental)
export type ID = number;

// a zero-based index
export type Index = number;

// offset in bytes in a Uint8Array buffer
export type Address = number;

// offset in BITS in a BitBuffer
export type BitAddress = number;

// UTC timestamp
export type Timestamp = number;

// available platforms
export type Platform = "discord" | "telegram" | "whatsapp";

export enum AttachmentType {
    Image,
    ImageAnimated, // (GIFs)
    Video,
    Sticker,
    Audio,
    Document,
    Other,
    Last,
}

// configuration, set in the UI
export interface ReportConfig {
    platform: Platform;
}

// the generated object after processing
export interface Database {
    config: ReportConfig;
    bitConfig: MessageBitConfig;
    title: string;
    time: {
        minDate: DateKey;
        maxDate: DateKey;
        numDays: number;
        numMonths: number;
    };

    channels: Channel[];
    authors: Author[];
    words: string[];
    emojis: Emoji[];
    mentions: string[];

    authorsOrder: number[];
    authorsBotCutoff: number;

    serialized?: SerializedData;
}

// additional serialized data (like messages)
export type SerializedData = Uint8Array;

/*
    Names are short to reduce the size when it's transferred from the Worker to the main thread
    It does not help with compression

    I-(Channel/Author) versions are the generated by the parsers
*/

// emitted by parsers
export interface IChannel {
    // name
    n: string;
}

export interface Channel extends IChannel {
    // name searchable
    ns: string;
    // messages location
    msgAddr: Address;
    msgCount: number;
}

// emitted by parsers
export interface IAuthor {
    // name
    n: string;
    // bot
    b?: undefined | true;
    // Discord discriminant (#XXXX)
    d?: number;
    // Discord avatar (user_id/user_avatar)
    da?: string;
}

export interface Author extends IAuthor {
    // name searchable
    ns: string;
}

export interface Emoji {
    // Discord emoji ID (if custom)
    id?: RawID;
    // name (🔥 or "custom_emoji")
    n: string;
}

// emitted by parsers
export interface IMessage {
    id: RawID;
    replyTo?: RawID;
    authorId: ID;
    channelId: ID;
    timestamp: Timestamp;
    timestampEdit?: Timestamp;
    content?: string;
    attachments: [AttachmentType, number][];
    reactions: [Emoji, number][];
}

interface CommonMessageFields {
    hour: number;
    authorId: ID;
    sentiment?: number;
    lang?: Index;
    words?: [Index, number][];
    emojis?: [Index, number][];
    mentions?: [Index, number][];
    reactions?: [Index, number][];
    domains?: [Index, number][];
    attachments?: [AttachmentType, number][];
}

// stored serialized during generation
export interface IntermediateMessage extends CommonMessageFields {
    day: Day;
}

// stored serialized on the final data file
// (and what aggregators use)
export interface Message extends CommonMessageFields {
    dayIndex: number;
}
