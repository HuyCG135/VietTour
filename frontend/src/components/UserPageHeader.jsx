export default function UserPageHeader({ title, subtitle }) {
    return (
        <div className="pb-5 border-b border-border">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-1">{title}</h2>
            {subtitle && <p className="text-sm text-muted mb-0">{subtitle}</p>}
        </div>
    );
}