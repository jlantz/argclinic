// ...existing imports...

export const ArgumentList: React.FC<Props> = ({ arguments, ...props }) => {
  return (
    <div className="mt-4">
      {arguments.length > 0 ? (
        <>
          <h3 className="text-2xl font-semibold mb-2">Parsed ARESR Arguments</h3>
          <div className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
            {arguments.map((arg, index) => (
              <ArgumentCard key={index} argument={arg} {...props} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-gray-600">No arguments parsed yet.</div>
      )}
    </div>
  );
};
