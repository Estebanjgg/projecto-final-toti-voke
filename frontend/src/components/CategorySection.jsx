import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      icon: '📱',
      name: 'Smartphones',
      color: '#FF69B4'
    },
    {
      icon: '📱',
      name: 'Tablets',
      color: '#4A90E2'
    },
    {
      icon: '💻',
      name: 'Notebooks',
      color: '#32CD32'
    },
    {
      icon: '🖥️',
      name: 'Desktops',
      color: '#FF6347'
    },
    {
      icon: '🖥️',
      name: 'Monitores',
      color: '#9370DB'
    },
    {
      icon: '🎧',
      name: 'Acessórios',
      color: '#FFD700'
    }
  ];

  return (
    <section className="category-section">
      <div className="container">
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div 
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                <span>{category.icon}</span>
              </div>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;