// import { SettingsIcon } from "../../icons/index";
// import { getStatus } from "../utils/getStatus";

// export default function ProductRow({ p, onEdit }) {
//   return (
//     <div className="grid grid-cols-[80px_2fr_120px_1fr_1.5fr_1fr_80px] items-center text-gray-700 text-sm px-8 py-3 gap-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
//       <div className="flex justify-center">
//         <img
//           src={p.image || `https://via.placeholder.com/40?text=${p.name?.[0] || "P"}`}
//           alt={p.name}
//           className="w-16 h-16 object-cover rounded"
//         />
//       </div>
//       <div className="truncate">{p.name}</div>
//       <div className="truncate max-w-[120px] text-ellipsis overflow-hidden">
//         ₱{Number(p.price ?? 0).toLocaleString("en-PH", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </div>
//       <div>{p.stock_quantity ?? 0}</div>
//       <div className="truncate">
//         {p.categories?.map((c) => c.name).join(", ") || "Uncategorized"}
//       </div>
//       <div>{getStatus(p)}</div>
//       <div className="flex justify-end">
//         <button onClick={() => onEdit(p)} className="text-gray-500 hover:text-gray-700">
//           <SettingsIcon className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }
