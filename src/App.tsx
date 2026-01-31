import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from './utils/cn';

// Ripple effect component
function Ripple({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <span
      className="absolute rounded-full animate-ripple pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 150,
        height: 150,
        marginLeft: -75,
        marginTop: -75,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

// Floating particle
function Particle({ delay, duration, size, color, startX, startY }: {
  delay: number;
  duration: number;
  size: number;
  color: string;
  startX: number;
  startY: number;
}) {
  return (
    <div
      className="absolute rounded-full animate-float-particle pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        filter: 'blur(1px)',
      }}
    />
  );
}

// Calculator button component
function CalcButton({
  children,
  onClick,
  variant = 'number',
  span = 1,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'function' | 'equals' | 'clear';
  span?: number;
  active?: boolean;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    
    onClick();
  };

  const gradients = {
    number: 'from-white/20 via-white/10 to-white/5',
    operator: 'from-orange-400/30 via-orange-500/20 to-orange-600/10',
    function: 'from-gray-300/30 via-gray-400/20 to-gray-500/10',
    equals: 'from-green-400/40 via-emerald-500/30 to-teal-600/20',
    clear: 'from-red-400/30 via-rose-500/20 to-pink-600/10',
  };

  const hoverGradients = {
    number: 'from-white/40 via-white/25 to-white/15',
    operator: 'from-orange-300/50 via-orange-400/40 to-orange-500/30',
    function: 'from-gray-200/50 via-gray-300/40 to-gray-400/30',
    equals: 'from-green-300/60 via-emerald-400/50 to-teal-500/40',
    clear: 'from-red-300/50 via-rose-400/40 to-pink-500/30',
  };

  const textColors = {
    number: 'text-white',
    operator: 'text-orange-300',
    function: 'text-gray-200',
    equals: 'text-white',
    clear: 'text-red-300',
  };

  const rippleColors = {
    number: 'rgba(255,255,255,0.4)',
    operator: 'rgba(251,146,60,0.5)',
    function: 'rgba(156,163,175,0.5)',
    equals: 'rgba(52,211,153,0.5)',
    clear: 'rgba(248,113,113,0.5)',
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      className={cn(
        'relative overflow-hidden rounded-3xl font-medium transition-all duration-300 ease-out',
        'backdrop-blur-xl border border-white/20',
        'shadow-lg shadow-black/20',
        'flex items-center justify-center',
        'h-[72px] md:h-[80px]',
        span === 2 ? 'col-span-2' : 'col-span-1',
        isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100',
        active && 'ring-2 ring-orange-400/60',
        textColors[variant],
      )}
      style={{
        background: `linear-gradient(145deg, ${isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}, rgba(255,255,255,0.05))`,
        boxShadow: isPressed 
          ? 'inset 0 2px 10px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)'
          : isHovered
          ? '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
          : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
      }}
    >
      {/* Gradient overlay */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
        isHovered ? hoverGradients[variant] : gradients[variant],
      )} />
      
      {/* Glass reflection */}
      <div 
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl"
        style={{ opacity: isPressed ? 0.1 : 0.2 }}
      />
      
      {/* Animated border glow on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-3xl animate-pulse" style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
          backgroundSize: '200% 200%',
        }} />
      )}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} color={rippleColors[variant]} />
      ))}
      
      {/* Content */}
      <span className={cn(
        'relative z-10 text-2xl md:text-3xl font-semibold transition-transform duration-150',
        'drop-shadow-lg',
        isPressed ? 'scale-90' : 'scale-100',
      )}>
        {children}
      </span>
    </button>
  );
}

// Main Display Component
function Display({ 
  value, 
  expression,
  history,
}: { 
  value: string; 
  expression: string;
  history: string[];
}) {
  const displayRef = useRef<HTMLDivElement>(null);

  // Dynamic font size based on value length
  const getFontSize = () => {
    const len = value.length;
    if (len <= 8) return 'text-5xl md:text-6xl';
    if (len <= 12) return 'text-4xl md:text-5xl';
    if (len <= 16) return 'text-3xl md:text-4xl';
    return 'text-2xl md:text-3xl';
  };

  return (
    <div 
      ref={displayRef}
      className="relative rounded-3xl p-6 mb-6 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
        boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.5}
            duration={4 + Math.random() * 3}
            size={4 + Math.random() * 6}
            color={`hsl(${200 + i * 20}, 70%, 60%)`}
            startX={Math.random() * 100}
            startY={Math.random() * 100}
          />
        ))}
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl" />
      
      {/* History */}
      <div className="relative h-16 overflow-hidden mb-2">
        <div className="absolute bottom-0 left-0 right-0 text-right space-y-1">
          {history.slice(-2).map((item, i) => (
            <div 
              key={i} 
              className="text-sm text-white/40 truncate animate-fade-in"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Expression */}
      <div className="relative text-right text-white/60 text-lg md:text-xl mb-2 h-7 truncate font-light tracking-wide">
        {expression || '\u00A0'}
      </div>
      
      {/* Main value */}
      <div className={cn(
        'relative text-right text-white font-bold tracking-tight transition-all duration-300',
        getFontSize(),
      )}>
        <span className="inline-block animate-value-change drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {value || '0'}
        </span>
      </div>
    </div>
  );
}

// Mode selector component
function ModeSelector({ 
  mode, 
  onModeChange 
}: { 
  mode: 'basic' | 'scientific';
  onModeChange: (mode: 'basic' | 'scientific') => void;
}) {
  return (
    <div className="flex gap-2 mb-4">
      {(['basic', 'scientific'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={cn(
            'flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-all duration-300',
            'backdrop-blur-xl border border-white/20',
            mode === m 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          )}
        >
          {m === 'basic' ? '🔢 Oddiy' : '🔬 Ilmiy'}
        </button>
      ))}
    </div>
  );
}

// Main App
export function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);

  // Format number for display
  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    
    const str = num.toString();
    if (str.includes('e')) return num.toExponential(6);
    if (str.length > 12) return num.toPrecision(10);
    
    return str;
  };

  // Input digit
  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(prev => prev === '0' ? digit : prev + digit);
    }
  }, [waitingForOperand]);

  // Input decimal
  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  }, [waitingForOperand, display]);

  // Clear all
  const clearAll = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
  }, []);

  // Clear entry
  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  // Toggle sign
  const toggleSign = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev);
      return formatNumber(-num);
    });
  }, []);

  // Percentage
  const percentage = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev);
      return formatNumber(num / 100);
    });
  }, []);

  // Perform operation
  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
      setExpression(`${display} ${nextOperator}`);
    } else if (pendingOperator) {
      const currentValue = storedValue;
      let result: number;

      switch (pendingOperator) {
        case '+': result = currentValue + inputValue; break;
        case '−': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = inputValue !== 0 ? currentValue / inputValue : NaN; break;
        case '^': result = Math.pow(currentValue, inputValue); break;
        default: result = inputValue;
      }

      setDisplay(formatNumber(result));
      setStoredValue(result);
      setExpression(`${formatNumber(result)} ${nextOperator}`);
    }

    setPendingOperator(nextOperator);
    setWaitingForOperand(true);
  }, [display, storedValue, pendingOperator]);

  // Calculate result
  const calculate = useCallback(() => {
    if (pendingOperator === null || storedValue === null) return;

    const inputValue = parseFloat(display);
    let result: number;

    switch (pendingOperator) {
      case '+': result = storedValue + inputValue; break;
      case '−': result = storedValue - inputValue; break;
      case '×': result = storedValue * inputValue; break;
      case '÷': result = inputValue !== 0 ? storedValue / inputValue : NaN; break;
      case '^': result = Math.pow(storedValue, inputValue); break;
      default: result = inputValue;
    }

    const fullExpression = `${expression} ${display} =`;
    setHistory(prev => [...prev, `${fullExpression} ${formatNumber(result)}`].slice(-10));
    
    setDisplay(formatNumber(result));
    setExpression('');
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
  }, [display, storedValue, pendingOperator, expression]);

  // Scientific functions
  const scientificFunction = useCallback((func: string) => {
    const num = parseFloat(display);
    let result: number;
    const angle = isRadians ? num : (num * Math.PI / 180);

    switch (func) {
      case 'sin': result = Math.sin(angle); break;
      case 'cos': result = Math.cos(angle); break;
      case 'tan': result = Math.tan(angle); break;
      case 'ln': result = Math.log(num); break;
      case 'log': result = Math.log10(num); break;
      case '√': result = Math.sqrt(num); break;
      case 'x²': result = num * num; break;
      case 'x³': result = num * num * num; break;
      case '1/x': result = 1 / num; break;
      case 'x!': result = factorial(num); break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case 'abs': result = Math.abs(num); break;
      default: result = num;
    }

    setDisplay(formatNumber(result));
    setWaitingForOperand(true);
  }, [display, isRadians]);

  // Factorial helper
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  // Memory functions
  const memoryAdd = () => setMemory(prev => prev + parseFloat(display));
  const memorySubtract = () => setMemory(prev => prev - parseFloat(display));
  const memoryRecall = () => { setDisplay(formatNumber(memory)); setWaitingForOperand(true); };
  const memoryClear = () => setMemory(0);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('−');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') { e.preventDefault(); performOperation('÷'); }
      else if (e.key === 'Enter' || e.key === '=') calculate();
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, calculate, clearAll]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] animate-orb-2" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[80px] animate-orb-3" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[60px] animate-orb-4" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.3}
            duration={8 + Math.random() * 4}
            size={2 + Math.random() * 4}
            color={`hsla(${Math.random() * 360}, 70%, 60%, 0.6)`}
            startX={Math.random() * 100}
            startY={Math.random() * 100}
          />
        ))}
      </div>

      {/* Calculator Container */}
      <div 
        className={cn(
          'relative w-full transition-all duration-500',
          mode === 'basic' ? 'max-w-[380px]' : 'max-w-[500px]'
        )}
      >
        {/* Main glass container */}
        <div 
          className="rounded-[40px] p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.4),
              0 0 80px rgba(139,92,246,0.2),
              inset 0 0 80px rgba(255,255,255,0.05),
              inset 0 2px 2px rgba(255,255,255,0.2)
            `,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Glass shine effect */}
          <div 
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              borderRadius: '40px 40px 0 0',
            }}
          />
          
          {/* Liquid effect animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-liquid-rotate opacity-20">
              <div className="absolute inset-0 bg-gradient-conic from-purple-500 via-transparent to-blue-500" />
            </div>
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-4">
            <h1 className="text-white/80 text-lg font-light tracking-wider">
              ✨ Liquid Glass
            </h1>
            <div className="flex gap-2">
              {memory !== 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/70">
                  M: {memory.toFixed(2)}
                </span>
              )}
              {mode === 'scientific' && (
                <button
                  onClick={() => setIsRadians(!isRadians)}
                  className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/70 hover:bg-white/30 transition-colors"
                >
                  {isRadians ? 'RAD' : 'DEG'}
                </button>
              )}
            </div>
          </div>

          {/* Mode Selector */}
          <ModeSelector mode={mode} onModeChange={setMode} />

          {/* Display */}
          <Display value={display} expression={expression} history={history} />

          {/* Scientific buttons */}
          {mode === 'scientific' && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              <CalcButton variant="function" onClick={() => scientificFunction('sin')}>sin</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('cos')}>cos</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('tan')}>tan</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('ln')}>ln</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('log')}>log</CalcButton>
              
              <CalcButton variant="function" onClick={() => scientificFunction('√')}>√</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('x²')}>x²</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('x³')}>x³</CalcButton>
              <CalcButton variant="function" onClick={() => performOperation('^')}>xʸ</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('x!')}>x!</CalcButton>
              
              <CalcButton variant="function" onClick={() => scientificFunction('π')}>π</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('e')}>e</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('1/x')}>1/x</CalcButton>
              <CalcButton variant="function" onClick={() => scientificFunction('abs')}>|x|</CalcButton>
              <CalcButton variant="function" onClick={() => { setDisplay(prev => prev + '('); }}>()</CalcButton>
            </div>
          )}

          {/* Memory buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <CalcButton variant="function" onClick={memoryClear}>MC</CalcButton>
            <CalcButton variant="function" onClick={memoryRecall}>MR</CalcButton>
            <CalcButton variant="function" onClick={memorySubtract}>M−</CalcButton>
            <CalcButton variant="function" onClick={memoryAdd}>M+</CalcButton>
          </div>

          {/* Main buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <CalcButton variant="clear" onClick={clearAll}>AC</CalcButton>
            <CalcButton variant="function" onClick={clearEntry}>C</CalcButton>
            <CalcButton variant="function" onClick={percentage}>%</CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation('÷')} active={pendingOperator === '÷'}>÷</CalcButton>

            {/* Row 2 */}
            <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
            <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
            <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation('×')} active={pendingOperator === '×'}>×</CalcButton>

            {/* Row 3 */}
            <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
            <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
            <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation('−')} active={pendingOperator === '−'}>−</CalcButton>

            {/* Row 4 */}
            <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
            <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
            <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation('+')} active={pendingOperator === '+'}>+</CalcButton>

            {/* Row 5 */}
            <CalcButton onClick={toggleSign}>±</CalcButton>
            <CalcButton onClick={() => inputDigit('0')}>0</CalcButton>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
            <CalcButton variant="equals" onClick={calculate}>=</CalcButton>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/30 text-xs">
              ⌨️ Klaviatura yordamida ham foydalanishingiz mumkin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
