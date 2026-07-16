export default function OrderItemList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        // Build options text from order_item_options or selected_options
        const options = item.order_item_options?.map(o => o.option_name).join(', ')
          || (item.selected_options && item.selected_options.length > 0
            ? item.selected_options.map(o => o.name).join(', ')
            : '');

        return (
          <li key={item.id} className="flex items-start gap-1.5 text-[13px]">
            <span className="text-brand-gray font-medium flex-shrink-0">•</span>
            <div className="min-w-0">
              <span className="text-brand-dark">
                <span className="font-semibold">{item.quantity}</span>
                {' '}
                {item.product_name}
              </span>
              {options && (
                <span className="text-brand-gray italic ml-1 text-xs">
                  {options}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
