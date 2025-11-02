export { default as DualPanelModal } from '../../common/DualPanelModal'
export { default } from './CreateCategoryModal';

export { default as AvailableProducts } from './AvailableProductList'
export { default as CategoryNameInput } from './CategoryNameInput'
export { default as ProductSearchFilter } from './ProductSearchFilter'
export { default as ProductSearchPanel } from './ProductSearchPanel' // Corrected capitalization
export { default as CategoryConfirmModal } from '../../common/CategoryConfirmModal' // FIX: Changed to named re-export to resolve SyntaxError
export { default as SelectedProductsList } from './SelectedProductsList'

export { useCreateCategoryForm } from './useCreateCategoryForm'
