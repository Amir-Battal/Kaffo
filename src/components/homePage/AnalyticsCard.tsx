import styled from 'styled-components';

interface AnalyticsCardProps {
  number: string;
  description: string;
}

const AnalyticsCard = ({ number, description }: AnalyticsCardProps) => {
  return (
    <CardWrapper>
      <h2 className="text-4xl font-bold text-gray-800">{number}</h2>
      <p className="text-center text-gray-700 mt-2">{description}</p>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  background-color: #f9fbfc;
  padding: 2rem;
  width: 25%;
  height: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%; /* فقط النصف العلوي */
    background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0);
    background-size: 12px 12px;
    background-position: center;
    pointer-events: none;
  }
`;



export default AnalyticsCard;
