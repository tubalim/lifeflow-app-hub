import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What is LifeFlow?',
    answer:
      'LifeFlow is your personal life management companion designed specifically for medical students. It helps you track tasks, expenses, habits, study time, and more - all in one place.',
  },
  {
    question: 'How does the Pomodoro Timer work?',
    answer:
      'The Pomodoro Technique is a time management method. Work for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break. This helps maintain focus and prevent burnout during study sessions.',
  },
  {
    question: 'Is my data saved securely?',
    answer:
      'Yes! All your data is stored securely in the cloud and is only accessible by you. We use industry-standard encryption and authentication to protect your information.',
  },
  {
    question: 'Can I use LifeFlow on multiple devices?',
    answer:
      'Absolutely! Since your data is stored in the cloud, you can access LifeFlow from any device by simply logging into your account. All your tasks, notes, and progress will sync automatically.',
  },
  {
    question: 'How do I reset my exam countdown date?',
    answer:
      'Navigate to the Countdown page and use the date picker to set your new exam date. The countdown will update automatically to show the remaining days until your exam.',
  },
];

export default function AppFAQ() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-accent">
          <HelpCircle className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">App FAQ</h1>
          <p className="text-muted-foreground">Frequently asked questions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-accent/30">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Have more questions? Feel free to explore the app or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
