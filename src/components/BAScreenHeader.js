import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function BAScreenHeader({ title, actionButtons, showBackButton }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg p-3 mb-4 bg-white  border flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-green-600  text-lg"
          />
        )}
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex gap-3">
        {actionButtons.map((button, index) => (
          <div key={index}>{button.display()}</div>
        ))}
      </div>
    </div>
  );
}