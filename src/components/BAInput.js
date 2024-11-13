import { Input } from "antd";

export default function BAInput(props) {
  const { label, onChange, disabled, type } = props;
  return (
    <>
      <Input
        placeholder={label}
        onChange={onChange}
        disabled={disabled}
        type={type}
      />
    </>
  );
}