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
  
      setPreviewFile(file.url || (file.preview as string));
      setPreviewOpen(true);
      setPreviewFileName(file.name);
    }, []);
  
    const handleUploadChange: UploadProps["onChange"] = ({
      fileList: newFileList,
    }) => {
      // console.log("New", newFileList);
      setFileList(newFileList);
    };
    const handleCropModalClose = useCallback(() => {
      setCropModalVisible(false);
    }, []);
  
    const handleCropSubmit = useCallback((image: string) => {
      setFileList((prev) => [{ ...prev[0], url: image }]);
      let formData = new FormData();
      formData.append("file", image);
      console.log(image, formData);
      uploadSportImage(sessionStorage?sessionStorage:"", 1, image);
    }, []);
  
    const handleUpload = async () => {};
  
    const draggerProps: UploadProps = {
      name: "image",
      // action: "",
      accept: acceptedFiles,
      onChange: handleUploadChange,
      beforeUpload: (file) => {
        setFileList([file]);
        fileRef.current = file;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          console.log("READER RESULT", reader.result);
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
        <Button onClick={handleUpload}>AAA</Button>
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
  