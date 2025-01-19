import React, { useRef, useState, useEffect } from "react";

const WhiteBoard = () => {
  const canvasRef = useRef(null); // Canvas Reference
  const contextRef = useRef(null); // Stores the 2D Drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(5); // Default stroke width

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2; // Adjust for high-DPI displays
    canvas.height = canvas.offsetHeight * 2;
    const context = canvas.getContext("2d");
    context.scale(2, 2); // Scale to match canvas dimensions
    context.lineCap = "round";
    context.lineWidth = strokeWidth;
    context.strokeStyle = "#000"; // Default color: Black
    contextRef.current = context;

    // Set Default stroke color to Black when loaded
    setSelectedColor("#000000");
  }, []); // Re-run when strokeWidth changes

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const Colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#008000",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#808080",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#00FF00"
  ];

  const colorSelection = (color) => {
    setSelectedColor(color); // Update the selected color
    contextRef.current.strokeStyle = color; // Change the stroke style for the canvas
  };

  const changeStrokeWidth = (width) => {
    setStrokeWidth(width); // Update the stroke width
    contextRef.current.lineWidth = width; // Apply the new stroke width
  };

  const setClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="border-4 border-[#00142d] bg-white col-span-4 rounded-md relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair rounded-md"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-[#f5fdff] border-t-4 border-[#00142d] min-h-fit p-2 z-10 flex justify-between items-center">
        {/* Color Selection Panel */}
        <div className="w-fit h-full grid grid-cols-8 grid-rows-2 gap-2">
          {Colors.map((color, index) => (
            <button
              key={index}
              className={`p-3 w-fit h-fit rounded-md border ${
                selectedColor === color ? "border-black" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => colorSelection(color)}
            />
          ))}
        </div>
        {/* Stroke Width Selection */}
        <div className="flex justify-end items-center gap-2">
          {[5, 10, 20, 50].map((width) => (
            <button
              key={width}
              className={`w-fit h-fit rounded-full bg-black ${
                strokeWidth === width ? "border-4 border-blue-500" : ""
              }`}
              style={{
                width: `${width}px`,
                height: `${width}px`
              }}
              onClick={() => changeStrokeWidth(width)}
            />
          ))}
        </div>
      </div>
      {/* Clear Canvas Button */}
      <button onClick={setClearCanvas} className="absolute top-2 right-3">
        Clear
      </button>
    </div>
  );
};

export default WhiteBoard;
