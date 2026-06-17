
type AgencyLogoType = {
    logo: string;
}
export interface AgencyLogoResponse {
    status: string;
    message: string;
    data: AgencyLogoType
}

export type AgencyDocumentType = {
    documents: {
        id: string;
        filename: string;
        url: string;
        size: number
        type: string
        publicId: string
        uploadedAt: string
    }[];
};

export interface AgencyDocumentResponse {
    status: string;
    message: string;
    data: AgencyDocumentType

}

// {
//     "status": "success",
//     "message": "Documents fetched successfully",
//     "data": {
//         "documents": [
//             {
//                 "id": "ce37728b-353d-4f2d-889c-4469fc96196d",
//                 "url": "https://res.cloudinary.com/dabmdfm7c/image/upload/v1777375346/CareStandard/agencies/150dbe41-f381-48e7-a317-03a78ba19456/documents/1777375345808-Shemewe_Workflow_Template.pdf",
//                 "name": "Shemewe_Workflow_Template.pdf",
//                 "size": 19777,
//                 "type": "application/pdf",
//                 "publicId": "CareStandard/agencies/150dbe41-f381-48e7-a317-03a78ba19456/documents/1777375345808-Shemewe_Workflow_Template",
//                 "uploadedAt": "2026-04-28T11:22:26.739Z"
//             },

export type FileStatus = "done" | "error";
export type DocumentItem = {
    id: string;
    source: "server" | "local"; // 👈 THIS is the key
    file?: File;
    url?: string;
    name: string;
    sizeBytes: number;
    mime?: string;
    createdAt: Date;
    status: FileStatus;
    previewUrl?: string;
};