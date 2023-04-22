import { Modal, ModalProps, Slider, UploadFile } from "antd";
import React, { MutableRefObject, useCallback, useEffect } from "react";
import { useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";
import { getCroppedImg } from "../../utils/utils";

interface Props extends ModalProps {
  imageSrc: string;
  fileRef: MutableRefObject<UploadFile>;
  handleCropComplete: (image: Blob) => void;
}

const ImageCropper: React.FunctionComponent<Props> = ({
  imageSrc,
  fileRef,
  handleCropComplete,
  ...props
}) => {
  const [image, setImage] = useState(imageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [croppedImage, setCroppedImage] = useState<Blob | null>();

  const onCropComplete = useCallback(
    async (croppedArea: Area, cropedPixels: Area) => {
      const croppedImage = await getCroppedImg(imageSrc, cropedPixels);
      console.log("CROPPED", croppedImage);
      
      setCroppedImage(croppedImage);
    },
    []
  );


  const handleModalOk = useCallback(
    () => {
      if (!croppedImage) {
        return;
      }
      handleCropComplete(croppedImage)
    },
    [croppedImage]
  );

  return (
    <Modal {...props} onOk={handleModalOk} destroyOnClose>
      <div style={{ height: 500, width: 500 }}>
        {image && (
          <>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{
                containerStyle: { height: "70%", marginTop: 50 },
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ImageCropper);