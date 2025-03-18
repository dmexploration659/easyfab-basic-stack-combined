export default function WorkbenchPart({ partId, partData, onSelect }) {
    return (
      <div 
        className="footer_card" 
        data-id={partData.title}
        id={partId}
        onClick={() => onSelect(partData)}
      >
        {Object.entries(partData)
          .filter(([key]) => key !== 'title')
          .map(([key, data]) => (
            <p key={key}>
              {key}:{data.val} {data.unit}
            </p>
          ))
        }
      </div>
    );
  }