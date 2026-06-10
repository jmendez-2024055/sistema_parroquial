import { categoryTones } from '../data/mockData.js';

const CategoryBadge = ({ category }) => {
  const tone = categoryTones[category] ?? 'default';

  return (
    <span className={`category-badge category-badge--${tone}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
