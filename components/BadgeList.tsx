import _debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import Badge from "./BadgeInterface";
import LazyImage from "./LazyImage";

export default function BadgeList() {
  const baseUrl =
    "https://raw.githubusercontent.com/ggez05/python-credly-scrapper/main/data/badges.json";
  const [badges, setBadges] = useState<Badge[]>([]);
  const [permBadges, setPermBadges] = useState<Badge[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState({
    cost: "",
    level: "",
    type_category: "",
  });

  const [typeCategories, setTypeCategories] = useState<string[]>([]);
  const [costs, setCosts] = useState<Array<number | null>>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBadges() {
      const response = await fetch(baseUrl);
      const data = await response.json();

      // Convert the object of objects into an array
      const badgeArray: Badge[] = Object.values(data);
      setPermBadges(badgeArray);
      setBadges(badgeArray);
    }

    fetchBadges();
  }, [baseUrl]);

  useEffect(() => {
    // Get unique type_category values
    let uniqueTypeCategories = [
      ...new Set(permBadges.map((badge) => badge.type_category)),
    ];
    uniqueTypeCategories = uniqueTypeCategories.filter((elem) => {
      return elem !== null;
    });
    console.log(uniqueTypeCategories);
    console.log(badges);
    setTypeCategories(uniqueTypeCategories);

    // Get unique cost values and filter out null values
    const uniqueCosts = [
      ...new Set(
        permBadges.map((badge) => badge.cost).filter((cost) => cost !== null)
      ),
    ];
    setCosts(uniqueCosts);

    // Get unique level values
    let uniqueLevels = [...new Set(permBadges.map((badge) => badge.level))];
    uniqueLevels = uniqueLevels.filter((elem) => {
      return elem !== null;
    });
    setLevels(uniqueLevels);
  }, [permBadges]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
    debouncedSearch(value);
  };

  const debouncedSearch = _debounce((value) => {
    setBadges(
      permBadges.filter((badge) => {
        const nameMatches = badge.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const costMatches =
          filter.cost === "" || badge.cost?.toString() === filter.cost;

        const levelMatches =
          filter.level === "" || badge.level === filter.level;

        const typeCategoryMatches =
          filter.type_category === "" ||
          badge.type_category === filter.type_category;

        return (
          nameMatches && costMatches && levelMatches && typeCategoryMatches
        );
      })
    );
    console.log("Searching for:", value);
  }, 1000);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <div className="flex justify-center mb-10 gap-5">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-72 p-4 ps-10 text-sm text-black border border-b-2 border-t-0 border-r-0 border-l-0 border-black bg-white focus:border-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <label htmlFor="cost" className="sr-only"></label>
        <select
          id="cost"
          name="cost"
          value={filter.cost}
          onChange={handleFilterChange}
          className="block py-2.5 px-0 w-40 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value="">Select cost</option>
          {costs.map((cost) => (
            <option key={cost} value={cost}>
              {cost}
            </option>
          ))}
        </select>
        <label htmlFor="level" className="sr-only"></label>
        <select
          id="level"
          name="level"
          value={filter.level}
          onChange={handleFilterChange}
          className="block py-2.5 px-0 w-40 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value="">Select level</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <label htmlFor="type_category" className="sr-only"></label>
        <select
          id="type_category"
          name="type_category"
          value={filter.type_category}
          onChange={handleFilterChange}
          className="block py-2.5 px-0 w-40 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value="">Select type category</option>
          {typeCategories.map((typeCategory) => (
            <option key={typeCategory} value={typeCategory}>
              {typeCategory}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap p-0 list-none gap-10 justify-center">
        {badges.map((badge) => (
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <LazyImage
              src={badge.image.url}
              alt={badge.name}
              className="w-full h-auto mb-2"
            />
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {badge.name}
                </h5>
              </a>
              <span className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <p className="pb-2">{badge.description}</p>
                <p className="pb-2">
                  {badge.level ? <strong>Level: </strong> : ""}
                  {badge.level}
                </p>
                <p className="pb-2">
                  {badge.type_category ? <strong>Type Category: </strong> : ""}
                  {badge.type_category}
                </p>
                <p className="pb-2">
                  {badge.issuer ? <strong>Issuer: </strong> : ""}
                  {badge.issuer.summary.charAt(0).toUpperCase() +
                    badge.issuer.summary.slice(1)}
                </p>
                <p className="pb-2">
                  {badge.issuer ? <strong>Skills: </strong> : ""}
                  {badge.skills.map((skill) => (
                    <span key={skill.id}>{skill.name}, </span>
                  ))}
                </p>
              </span>
              <a
                href={
                  badge.global_activity_url
                    ? badge.global_activity_url
                    : badge.url
                }
                target="_blank"
                className="inline-flex mt-8 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Read more
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
