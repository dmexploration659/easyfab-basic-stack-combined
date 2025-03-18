export default function StockCard({ item, onOpenSizeModal }) {
    return (
      <div 
        className="stock_card" 
        data-id={item.type}
        onClick={() => onOpenSizeModal(item)}
      >
        <p>{item.type}</p>
      </div>
    );
  }
  