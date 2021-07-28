import { DataType, SignalType } from "@/type";

interface CreateMessage {
  data?: string;
  type?: DataType;
}

const createMessage = ({
  data = "",
  type = DataType.MESSAGE,
}: CreateMessage) => {
  return {
    data,
    type,
  };
};

const createSignalMessage = (data: { type: SignalType; data: any }) => {
  return data;
};

export { createSignalMessage };

export default createMessage;
