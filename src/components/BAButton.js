import { Button } from "antd";

export default function BAButton(props) {
  const { label, onClick, disabled, loading } = props;
  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={onClick}
          disabled={disabled}
          loading={loading}
        >
          {label}
        </Button>
      </div>
    </>
  );
}