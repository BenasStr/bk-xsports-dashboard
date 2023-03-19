import { Modal, ModalProps, Slider, UploadFile } from "antd";
import React, { MutableRefObject, useCallback, useEffect } from "react";
import { useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";
import getCroppedImg from "../../utils/utils";

interface Props extends ModalProps {
  imageSrc: string;
  fileRef: MutableRefObject<UploadFile>;
  handleCropComplete: (image: string) => void;
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
  const [croppedImage, setCroppedImage] = useState<string>("");

  const onCropComplete = useCallback(
    async (croppedArea: Area, cropedPixels: Area) => {
      try {
        if (!image) {
          console.log("?????");
          return;
        }
        const convImage = await getCroppedImg(image, croppedArea);
        console.log("IMAGE", image);
        // setCrop();
        convImage && setCroppedImage(convImage);
        // handleCropComplete(image);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );
  console.log("IMAGE", image, fileRef);
  const handleModalOk = useCallback(
    () => handleCropComplete(croppedImage),
    [croppedImage]
  );

  return (
    <Modal {...props} onOk={handleModalOk}>
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
            <Slider
              min={0}
              max={1}
              step={0.1}
              style={{ bottom: 0, position: "relative" }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ImageCropper);
