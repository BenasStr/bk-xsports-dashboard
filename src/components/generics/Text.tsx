import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { TitleProps } from "antd/es/typography/Title";
import React from "react";

interface Props {
  title?: {
    level: TitleProps["level"];
  };
  align?: "left" | "center" | "right";
  strong?: boolean;
  copyable?: TextProps["copyable"];
  italic?: boolean;
  elipsis?: TextProps["ellipsis"];
  type?: TextProps["type"];
}

const Text: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
  title,
  align,
  children,
  ...restProps
}) => {
  return (
    <div style={{ textAlign: align }}>
      {title ? (
        <Typography.Title level={title.level} {...restProps}>
          {children}
        </Typography.Title>
      ) : (
        <Typography.Text {...restProps}>{children}</Typography.Text>
      )}
    </div>
  );
};

export default React.memo(Text);
