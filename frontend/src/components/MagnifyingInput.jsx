import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export function MagnifyingInput({ onAdd, placeholder = "What needs to be done?" }) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  // Handle outside click to collapse
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target) && !value) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue("");
      // Keep focus for rapid entry, or collapse? 
      // User said: "Input contracts back to original position"
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {/* Dimmed Background Overlay */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-10"
            onClick={() => {
                if(!value) setIsFocused(false);
            }} // Click overlay to dismiss if empty
          />
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full max-w-2xl mx-auto my-8 font-sans">
        <motion.form
          onSubmit={handleSubmit}
          layout
          initial={false}
          animate={{
            scale: isFocused ? 1.05 : 1,
            boxShadow: isFocused 
              ? "0 20px 40px -10px rgba(0,0,0,0.15)" 
              : "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={clsx(
            "relative flex items-center overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 border transition-colors",
            isFocused ? "border-transparent" : "border-zinc-200 dark:border-zinc-700"
          )}
          onClick={() => {
            setIsFocused(true);
            inputRef.current?.focus();
          }}
        >
          {/* Icon/Indicator */}
          <div className="pl-4 text-zinc-400 dark:text-zinc-500">
             <motion.div 
               animate={{ rotate: isFocused ? 90 : 0 }}
               transition={{ duration: 0.2 }}
             >
                {isFocused ? <Plus size={24} /> : <Search size={24} />}
             </motion.div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={isFocused ? "" : placeholder}
            className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
            autoComplete="off"
          />

          {/* Submit Button / Enter Hint */}
          <AnimatePresence>
            {isFocused && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                type="submit"
                disabled={!value.trim()}
                className="mr-2 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              >
                <ArrowRight size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.form>
        
        {/* Helper text */}
        <AnimatePresence>
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 right-0 -bottom-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                    Press <span className="font-medium text-zinc-800 dark:text-zinc-200">Enter</span> to add
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </>
  );
}
