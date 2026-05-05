type Props = {
  title: string;
  data?: any;
  color: string;
};

export default function ResultCard({ title, data, color }: Props) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className={`p-4 rounded-xl ${color}`}>
      <h2 className="text-xl font-semibold mb-3 text-black">
        {title}
      </h2>

      {safeData.length === 0 && (
        <p className="text-gray-700">No colleges</p>
      )}

      {safeData.map((college: any, index: number) => (
        <div
          key={index}
          className="bg-white p-4 mb-3 rounded-lg shadow-sm"
        >
          {/* 🔥 COLLEGE NAME CLEAR */}
          <p className="text-black font-semibold text-base mb-2">
            {college.collegeName}
          </p>

          {/* 🔥 MINIMAL TEXT */}
          <p className="text-sm text-gray-700">
            Opening: <span className="font-medium">{college.safeRank}</span>
          </p>

          <p className="text-sm text-gray-700">
            Closing: <span className="font-medium">{college.avgClosingRank}</span>
          </p>
        </div>
      ))}
    </div>
  );
}