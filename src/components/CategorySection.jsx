import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      icon: '/picture/Smartphones.png',
      name: 'Smartphones',
      key: 'smartphones',
      color: '#FF69B4'
    },
    {
      icon: '/picture/Tablets.png',
      name: 'Tablets',
      key: 'tablets',
      color: '#4A90E2'
    },
    {
      icon: '/picture/Notebooks.png',
      name: 'Notebooks',
      key: 'notebooks',
      color: '#32CD32'
    },
    {
      icon: '/picture/Desktops.png',
      name: 'Desktops',
      key: 'desktops',
      color: '#FF6347'
    },
    {
      icon: '/picture/Monitores.png',
      name: 'Monitores',
      key: 'monitores',
      color: '#9370DB'
    },
    {
      icon: '/picture/Acessorios.png',
      name: 'Acessórios',
      key: 'acessorios',
      color: '#FFD700'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/categoria/${category.key}`);
  };

  return (
    <section className="category-section">
      <div className="container">
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-item"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-icon">
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  className="category-icon-img"
                />
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