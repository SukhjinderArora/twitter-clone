/* eslint-disable react/jsx-no-constructed-context-values */
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

import usePageTitle from '../../hooks/usePageTitle';
import RadioButton from '../../components/RadioButton';

import { useTheme } from '../../contexts/theme-context';

const Display = () => {
  usePageTitle('Display / Kookoo');
  const navigate = useNavigate();
  const {
    primaryColor,
    setPrimaryColor,
    primaryColors,
    theme,
    setTheme,
    themes,
  } = useTheme();
  return (
    <div>
      <div className="px-4 py-4 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-on-surface"
            title="back"
          >
            <IconContext.Provider
              value={{
                size: '18px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiArrowLeftLine />
            </IconContext.Provider>
          </button>
          <header>
            <h3 className="text-xl font-semibold">Display</h3>
          </header>
        </div>
      </div>
      <div className="border-t border-on-surface/30 py-4 px-4">
        <h3 className="font-semibold text-xl">Color</h3>
        <div role="radiogroup" className="mt-3 flex justify-between px-4">
          {primaryColors.map((color) => (
            <div
              key={color.name}
              onClick={() => setPrimaryColor(color.name)}
              onKeyDown={(e) => e.key !== 'Tab' && setPrimaryColor(color.name)}
              role="button"
              tabIndex={0}
            >
              <RadioButton
                id={color.name}
                name="color"
                value={color.name}
                bgColor={color.color}
                fgColor="#fff"
                selected={primaryColor.name === color.name}
                size="40px"
                radioBtnChangeHandler={(id) => {
                  setPrimaryColor(id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-on-surface/30 py-4 px-4">
        <h3 className="font-semibold text-xl">Background</h3>
        <div role="radiogroup" className="mt-3 flex gap-5 justify-between px-4">
          {themes.map((t) => (
            <div
              key={t.name}
              className="flex flex-1 py-5 px-3 gap-5 items-center cursor-pointer"
              style={{
                backgroundColor: t.bgColor,
                color: t.fgColor,
                border: `2px solid ${
                  theme.name === t.name ? primaryColor.color : 'transparent'
                }`,
              }}
              onClick={() => setTheme(t.name)}
              onKeyDown={(e) => e.key !== 'Tab' && setTheme(t.name)}
              role="button"
              tabIndex={0}
            >
              <div className="flex">
                <RadioButton
                  id={t.name}
                  name="theme"
                  value={t.name}
                  bgColor={
                    theme.name === t.name ? primaryColor.color : 'transparent'
                  }
                  fgColor="#fff"
                  selected={theme.name === t.name}
                  size="20px"
                  borderColor={
                    theme.name === t.name ? 'transparent' : `${t.fgColor}4d`
                  }
                  radioBtnChangeHandler={(id) => {
                    setTheme(id);
                  }}
                />
              </div>
              <p className="capitalize font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Display;
