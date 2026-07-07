import gymFactoryLogo from "@/assets/gym-factory-logo.jpg";

type GymFactoryLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
  full?: boolean;
};

const GymFactoryLogo = ({
  className = "",
  markClassName = "",
  textClassName = "",
  showTagline = false,
  full = false,
}: GymFactoryLogoProps) => {
  if (full) {
    return (
      <img
        src={gymFactoryLogo}
        alt="Gym Factory - One Life, One Body, Make It Count"
        className={`mx-auto h-40 w-40 object-contain md:h-52 md:w-52 ${className} ${markClassName}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={gymFactoryLogo}
        alt="Gym Factory"
        className={`h-11 w-11 object-contain ${markClassName}`}
      />
      <div className={textClassName}>
        <div className="font-black uppercase leading-none tracking-wide text-foreground">
          Gym Factory
        </div>
        {showTagline && (
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            One Life - One Body - Make It Count
          </div>
        )}
      </div>
    </div>
  );
};

export default GymFactoryLogo;
