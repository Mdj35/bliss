import React, { useState } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const FilterModal = ({ isOpen, onClose, columns, selectedColumns, onColumnChange, onDateRangeChange }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateUntil, setDateUntil] = useState('');

  if (!isOpen) return null;

  const handleDateRangeChange = () => {
    onDateRangeChange(dateFrom, dateUntil);
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <ModalContainer>
        <h2>Filter Columns</h2>
        <form>
          {columns.map((column) => (
            column !== 'DATE RECEIVED' ? (
              <div key={column}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => onColumnChange(column)}
                  />
                  {column}
                </label>
              </div>
            ) : (
              <div key={column}>
                <label>{column}</label>
                <div>
                  <label>
                    From:
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </label>
                  <label>
                    Until:
                    <input
                      type="date"
                      value={dateUntil}
                      onChange={(e) => setDateUntil(e.target.value)}
                    />
                  </label>
                  <button type="button" onClick={handleDateRangeChange}>Apply</button>
                </div>
              </div>
            )
          ))}
        </form>
        <button onClick={onClose}>Close</button>
      </ModalContainer>
    </>
  );
};

export default FilterModal;