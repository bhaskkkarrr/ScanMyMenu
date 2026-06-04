import { useContext, useState, useMemo } from "react";
import { PublicContext } from "../../context/PublicContext";
import "../../index.css";
import FoodFilterToggles from "../../components/FoodFilterToggles";
import { Triangle, Search } from "lucide-react";
import FoodLoaderDemo from "../../components/FoodLoader";
import ItemDetailModal from "../../components/ItemDetailModal";

export default function CustomerMenu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVariantIndex, setModalVariantIndex] = useState(0);
  const [filter, setFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const { isLoading, data, error } = useContext(PublicContext);
  const { menu = [] } = data || {};

  const filteredMenu = useMemo(() => {
    return menu
      .filter((category) =>
        categoryFilter === "All" ? true : category.name === categoryFilter
      )
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const matchesFilter =
            (filter === "veg" && item.isVeg === true) ||
            (filter === "nonveg" && item.isVeg === false) ||
            (filter === "bestseller" && item.isBestSeller === true) ||
            filter === null;

          const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesFilter && matchesSearch;
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, categoryFilter, filter, searchQuery]);

  const currency = data?.restaurant?.currency || "₹";

  const handleVariantChange = (itemId, variantIndex) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [itemId]: variantIndex,
    }));
  };

  const shouldOpenModal = (item) => {
    // If restaurant has images → always open
    if (data?.restaurant?.hasPictures) return true;

    // If no images → open only when extra info exists
    const hasDescription = item.description && item.description.trim() !== "";
    const hasVariants = item.variants && item.variants.length > 0;

    return hasDescription || hasVariants;
  };

  const handleItemClick = (item) => {
    if (!shouldOpenModal(item)) return;

    setSelectedItem(item);
    setModalVariantIndex(selectedVariants[item._id] || 0);
  };

  return (
    <div className="min-h-screen m mb-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <FoodLoaderDemo />
        </div>
      )}
      {!isLoading && error && (
        <div className="text-center text-red-600 mt-10 font-semibold px-4">
          {error}
        </div>
      )}

      {!isLoading && !error && data?.success === false && (
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="relative max-w-lg w-full">
            {/* Decorative background blobs */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>

            {/* Main card */}
            <div className="relative bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
              {/* Gradient top bar */}
              <div className="h-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400"></div>

              <div className="px-6 py-10 sm:px-10 sm:py-14 text-center">
                {/* Icon container with animation */}
                <div className="relative inline-block mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-red-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 rounded-full border-4 border-white shadow-lg">
                    <span className="text-5xl sm:text-6xl">🔒</span>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    We're Currently Closed
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto">
                  This restaurant is temporarily closed or not under service at
                  the moment.
                </p>

                {/* Info box */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 sm:p-5 border border-orange-100">
                  <div className="flex items-start gap-3 text-left">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm sm:text-base">
                        ℹ️
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm sm:text-base font-medium">
                        Please check back later or contact the restaurant for
                        more information about opening hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
                  <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                  <div className="w-2 h-2 rounded-full bg-red-300"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && data?.success !== false && (
        <div className="max-w-xl min-w-xs shadow mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-2 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Menu
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover our delicious offerings
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-2 sm:mb-8 space-y-2 sm:space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all text-gray-900 placeholder-gray-400 text-sm sm:text-base shadow-sm"
              />
            </div>
            <FoodFilterToggles setFilter={setFilter} filter={filter} />
          </div>

          {/* Category Pills */}
          <div className="mb-2 sm:mb-10">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 py-0.5 sm:mx-1 sm:px-0">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`flex-shrink-0 px-4 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 ${
                  categoryFilter === "All"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                }`}
              >
                All
              </button>
              {menu.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 ${
                    categoryFilter === cat.name
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-md"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
              
          {/* Menu Items Grid */}
          {filteredMenu.length > 0 ? (
            <div className="space-y-5 sm:space-y-14">
              {filteredMenu.map((category) => (
                <section key={category._id}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent"></div>
                  </div>

                  {data.restaurant.hasPictures ? (
                    <div className="grid grid-cols-2 gap-4">
                      {category.items.map((item) => {
                        return (
                          <div
                            key={item._id}
                            className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1"
                            onClick={() => handleItemClick(item)}
                          >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-4xl sm:text-5xl mb-2">
                                      🍽️
                                    </div>
                                    <p className="text-xs text-gray-400">
                                      No Image
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Badges Container */}
                              <div className="absolute inset-0 p-3">
                                {/* Veg/Non-veg Badge - Top Left */}
                                <div className="absolute top-2 left-2">
                                  {item.isVeg === false ? (
                                    <div className="flex items-center justify-center border-2 border-red-600 w-6 h-6 sm:w-7 sm:h-7 rounded bg-white/95 backdrop-blur-sm shadow-lg">
                                      <Triangle
                                        size={14}
                                        className="text-red-600"
                                        fill="currentColor"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center border-2 border-emerald-600 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg">
                                      <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                                    </div>
                                  )}
                                </div>

                                {/* Bestseller Badge - Top Right */}
                                {item.isBestSeller && (
                                  <div className="absolute top-2 right-2">
                                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg backdrop-blur-sm">
                                      <span>Bestseller</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-2 sm:p-5">
                              <h3 className="font-bold truncate text-gray-900 text-base sm:text-lg mb-2">
                                {item.name || "NA"}
                              </h3>
                              <p className="text-xs text-gray-600 truncate">
                                {" "}
                                {item.description}
                              </p>
                              <div className="flex items-end justify-between relative">
                                <div className="flex flex-col gap-1">
                                  {/* Display Price - either discounted or base */}
                                  <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                    {currency}
                                    {item.price ?? "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl -mt-5 divide-y divide-gray-200">
                      {category.items.map((item) => {
                        return (
                          <div
                            key={item._id}
                            onClick={() => handleItemClick(item)}
                            className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition"
                          >
                            {/* LEFT SIDE */}
                            <div className="flex items-center gap-3 pr-4">
                              {/* Veg / Non Veg Indicator */}
                              <div className="mt-1">
                                {item.isVeg === false ? (
                                  <div className="border-2 border-red-600 w-4 h-4 flex items-center justify-center rounded">
                                    <Triangle
                                      size={10}
                                      className="text-red-600"
                                      fill="currentColor"
                                    />
                                  </div>
                                ) : (
                                  <div className="border-2 border-emerald-600 w-4 h-4 flex items-center justify-center rounded">
                                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                                  </div>
                                )}
                              </div>

                              {/* Item Info */}
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900 text-base">
                                    {item.name}
                                  </span>

                                  {item.isBestSeller && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                      Bestseller
                                    </span>
                                  )}
                                </div>

                                {item.description && (
                                  <span className="text-sm text-gray-500 line-clamp-1">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* RIGHT SIDE PRICE */}
                            <div className="text-right min-w-[70px]">
                              <div className="text-lg font-bold text-emerald-600">
                                {currency}
                                {item.price ?? "-"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-6">
                <span className="text-4xl sm:text-5xl">🔍</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
            </div>
          )}
        </div>
      )}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          restaurant={data.restaurant}
          currency={currency}
          selectedVariantIndex={modalVariantIndex}
          onVariantChange={(i) => setModalVariantIndex(i)}
          onClose={() => setSelectedItem(null)}
        />
      )}
      
    </div>
  );
}
