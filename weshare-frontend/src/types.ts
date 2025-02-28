export interface UploadResponse {
    id: string;
  }
  
  export interface FileItem {
    id: string;
    name: string;
    url: string;
  }
  
  export interface FileListResponse {
    files: FileItem[];
  }