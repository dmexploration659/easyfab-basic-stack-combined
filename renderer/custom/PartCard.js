export default function PartCard({ content, onOpenModal }) {
    return (
      <div 
        className="sidebar_card" 
        id={content.title} 
        onClick={() => onOpenModal(content)}
      >
        <p>{content.title}</p>
        <img src={content.thumbnail} alt={content.title} />
      </div>
    );
  }