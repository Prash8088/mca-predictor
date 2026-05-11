type Props = {
  title: string;
  data?: any;
  color: string;
  message?: string;
};

export default function ResultCard({
  title,
  data,
  color,
  message,
}: Props) {

  const safeData = Array.isArray(data)
    ? data
    : [];

  return (

    <div className={`p-4 rounded-2xl shadow-lg ${color}`}>

      {/* 🔥 TITLE */}
      <h2 className="text-xl font-bold text-black mb-4 text-center">
        {title}
      </h2>

      {/* 🔥 EMPTY MESSAGE */}
      {safeData.length === 0 && (

        <div className="bg-white p-5 rounded-xl shadow-sm text-center">

          <p className="font-semibold text-gray-700">
            No Colleges Found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {message}
          </p>

        </div>
      )}

      {/* 🔥 COLLEGE CARDS */}
      {safeData.map(
        (
          college: any,
          index: number
        ) => (

          <div
            key={index}
            className="bg-white p-4 mb-4 rounded-xl shadow-sm hover:shadow-md transition"
          >

            {/* 🔥 COLLEGE NAME */}
            <p className="font-bold text-black text-base mb-2">
              {college.collegeName}
            </p>

            {/* 🔥 OPENING */}
            <p className="text-sm text-gray-700">
              Opening Rank:{" "}
              <span className="font-semibold">
                {college.safeRank}
              </span>
            </p>

            {/* 🔥 CLOSING */}
            <p className="text-sm text-gray-700">
              Closing Rank:{" "}
              <span className="font-semibold">
                {college.avgClosingRank}
              </span>
            </p>

            {/* 🔥 MATCH SCORE */}
            {/* {college.score && (

              <div className="mt-3">

                <div className="flex justify-between text-sm mb-1">

                  <span className="text-gray-600">
                    Match Score
                  </span>

                  <span className="font-semibold text-black">
                    {college.score}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">

                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${college.score}%`,
                    }}
                  />

                </div>

              </div>
            )} */}

          </div>
        )
      )}
    </div>
  );
}