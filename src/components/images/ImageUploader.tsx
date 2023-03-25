import {
  Button,
  Modal,
  ModalProps,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import { useCallback, useRef, useState } from "react";
import { uploadSportImage } from "../../api/api";
import { useSessionStorage } from "../../hooks";
import ImageCropper from "./ImageCropper";

const { Dragger } = Upload;

const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

const acceptedFiles = acceptedFileTypes.join(", ");

const ImageUploader: React.FunctionComponent<React.CSSProperties> = (
  styleProps
) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<string>("");
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile<string>[]>([]);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const fileRef = useRef<UploadFile>({} as UploadFile);
  const [editableFile, setEditableFile] = useState("");
  const {sessionStorage} = useSessionStorage();

  const handleCancel = useCallback(() => setPreviewOpen(false), []);

  const handlePreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewOpen(true);
    setPreviewFileName(file.name);
  }, []);
  const handleCropModalClose = useCallback(() => {
    setCropModalVisible(false);
  }, []);

  const handleCropSubmit = useCallback( async (image: Blob) => {
    let formData = new FormData();
    formData.append("file", image, "image.jpg")

    try {
        uploadSportImage(sessionStorage ? sessionStorage : "", 1, formData)
        handleCropModalClose();
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewFile(reader.result as string)
          setFileList((prev) => ([{...prev[0], thumbUrl: reader.result as string}]))
        }
      reader.readAsDataURL(image)
    } catch (err) {
      console.log("Burh 4");
    }
  }, []);

  const adjustPreviewFileThumbnail = useCallback((file: UploadFile) => {
    return { ...file, thumbUrl: previewFile } as UploadFile;
  }, [])

  const handleUpload = async () => {};

  const draggerProps: UploadProps = {
    name: "image",
    accept: acceptedFiles,
    beforeUpload: (file) => {
      fileRef.current = file;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") setEditableFile(reader.result);
      });
      reader.readAsDataURL(file);
      setCropModalVisible(true);
      return false;
    },
    listType: "picture-card",
    onPreview: handlePreview,
    fileList: fileList,
  };

  return (
    <div style={{ ...styleProps }}>
      {editableFile && (
        <ImageCropper
          imageSrc={editableFile}
          fileRef={fileRef}
          open={cropModalVisible}
          onCancel={handleCropModalClose}
          handleCropComplete={handleCropSubmit}
        />
      )}
      <PreviewModal
        file={previewFile}
        open={previewOpen}
        title={previewFileName}
        footer={null}
        onCancel={handleCancel}
      />
      <Dragger {...draggerProps}>Please Upload Here</Dragger>
    </div>
  );
};

interface PreviewModalProps extends ModalProps {
  file: string;
}

const PreviewModal: React.FunctionComponent<
  React.PropsWithChildren<PreviewModalProps>
> = ({ file, ...props }) => {
  return (
    <Modal {...props}>
      <img style={{ width: "100%" }} src={file} />
    </Modal>
  );
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default ImageUploader;
