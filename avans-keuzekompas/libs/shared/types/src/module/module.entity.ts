export interface Module {
    id: string;
    title: string;
    description: string | null;
    location: string;
    period: 'P1' | 'P2' | 'P3' | 'P4';
    studentCredits: number;
    language: 'NL' | 'EN';
    level: string | null;
    duration: string | null;
    offeredBy: string | null;
}