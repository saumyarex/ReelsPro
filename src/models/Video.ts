import mongoose, {Schema, models, model} from "mongoose";


const VIDEO_DIMENSION = {
    height : 1920,
    width : 1080,
} as const

export interface IVideo{
    _id?: mongoose.Types.ObjectId,
    userId: string,
    title: string,
    description: string,
    videoURL: string,
    thumbnailURL: string,
    controls: boolean,
    transformation?: {
        height: number,
        width: number,
        quality: number,
    }
}

export const videoSchema = new Schema<IVideo>(
    {
        userId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videoURL: {
            type: String,
            required: true
        },
        thumbnailURL: {
            type: String,
            required: true
        },
        controls: {
            type: Boolean,
            default: true
        },
        transformation: {
            height: {type: Number, default: VIDEO_DIMENSION.height},
            width: {type: Number, default: VIDEO_DIMENSION.width},
            quality: {
                type: Number,
                min: 1,
                max: 100
            }
        }
    },
    {
        timestamps: true
    }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video;