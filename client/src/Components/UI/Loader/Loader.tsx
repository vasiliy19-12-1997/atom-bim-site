import { FC } from "react";
import { Flex, Spin } from "antd";
import s from "./Loader.module.scss";
export const Loader: FC = () => {
  return (
    <Flex align="center" gap="middle">
      <Spin size="large" />
    </Flex>
  );
};
