export default function Home({ tokens }) {
  const tokenName = Object.keys(tokens)[0];
  const packages = Object.keys(tokens[tokenName]).sort();

  return (
    <div className="mt-8 font-mono antialiased">
      <div className="fixed pl-10">
        <h2 className="mb-8 font-bold text-gray-600">📦 Token Packages</h2>
        <ol className="-ml-2 list-decimal space-y-4 pl-10">
          {packages.map((pkg) => (
            <li key={pkg} className="pl-2 text-gray-600">
              <a className="hover:underline" href={`#${pkg}`}>
                {pkg}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className="ml-[300px]">
        <h1 className="mb-6 text-2xl font-bold">{tokenName}</h1>
        <div className="space-y-16">
          {packages.map((pkg) => (
            <div key={pkg} id={pkg}>
              <h2>📦 {pkg}</h2>
              <div className="mt-4 space-y-10">
                {Object.entries(tokens[tokenName][pkg]).map(([key, value]) => (
                  <PackageContent key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PackageContent({ name, value }) {
  return (
    <div>
      <p className="text-gray-600">{name}</p>
      <div className="mt-2 break-words">
        {value.value != null ? (
          <Value value={value.value} type={value.type} />
        ) : (
          <div className="space-y-4">
            {Object.entries(value).map(([key, value]) => (
              <PackageContent name={key} value={value} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Value({ value, type }) {
  if (type === "color" && typeof value === "string") {
    return <Color value={value} />;
  }

  return JSON.stringify(value);
}

function Color({ value }) {
  return (
    <div>
      <p>{value}</p>
      <div
        className="h-10 w-10 rounded-full border"
        style={{ backgroundColor: value }}
      ></div>
    </div>
  );
}

export async function getStaticProps() {
  function expandObj(obj, rootObj) {
    if (typeof obj === "object") {
      for (const keys in obj) {
        if (typeof obj[keys] === "object") {
          expandObj(obj[keys], rootObj != null ? rootObj : obj);
        } else if (
          typeof obj[keys] === "string" &&
          (obj[keys].startsWith("$") || obj[keys].startsWith("{"))
        ) {
          const keyPath = obj[keys].replace(/[\$\{\}]/g, "");
          obj[keys] = keyPath
            .split(".")
            .reduce((obj, prop) => obj[prop], rootObj);
        }
      }
    }
    return obj;
  }

  const tokens = require("../src/tokens.json");
  const expandedTokens = tokens;
  const tokenName = Object.keys(tokens)[0];
  expandedTokens[tokenName] = expandObj(tokens[tokenName]);

  return {
    props: {
      tokens: expandedTokens,
    },
  };
}
