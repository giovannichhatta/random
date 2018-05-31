/*
 * 16-02-2018
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace bcmd
{
    class Program
    {
        static string batchFile    = @"C:\users\" + Environment.UserName + @"\Desktop\history.txt";
        static string command      = "";
        static int    shellType    = 0;
        static string shellName    = "";
        static List<string> history = new List<string>();

        static void Main(string[] args)
        {   
            while (true)
            {
                command = "";
                titleName();
                menu();

                while (exit(command))
                {
                    titleName();
                    Console.Write("{0}> ", shellName);
                    command = Console.ReadLine();
                    history.Add(command);
                    Console.WriteLine(exec());
                }
            }
        }

        static string exec()
        {
            ProcessStartInfo task;

            if (shellType == 1)
                task = new ProcessStartInfo("cmd.exe", "/c " + command);
            else
                task = new ProcessStartInfo("powershell.exe", command);

            task.WorkingDirectory       = @"C:\users\"+Environment.UserName;
            task.RedirectStandardOutput = true;
            task.RedirectStandardError  = true;
            task.CreateNoWindow         = true;
            task.UseShellExecute        = false;

            specialCommands();

            Process process = Process.Start(task);

            string output  = process.StandardOutput.ReadToEnd();

            return output;
        }


        static void menu()
        {
            while (shellType != 1 && shellType != 2)
            {
                Console.WriteLine("This tool bypasses the 'Prevent access from command prompt' GPO when an administrator has forgotten to also disable {0}script processing.{0}",Environment.NewLine);
                Console.WriteLine("Would you like to use Powershell or command prompt?" + Environment.NewLine );
                Console.WriteLine("[0] Menu");
                Console.WriteLine("[1] CMD");
                Console.WriteLine("[2] Powershell");
                Console.Write(Environment.NewLine + "> ");
                try { shellType = Int32.Parse(Console.ReadLine()); } catch { Console.Clear(); }
            }

            if (shellType == 1)
            {
                shellType = 1;
                shellName = "CMD";
            }
            else
            {
                shellType = 2;
                shellName = "Powershell";
            }

            Console.Clear();
        }

        static bool exit(string exitCommand)
        {
            if (exitCommand == "menu" || exitCommand == "0")
            {
                shellType = 0;
                Console.Clear();
                return false;
            }
            return true;
        }

        static void titleName()
        {
            switch (shellType)
            {
                case 1:
                    Console.Title = "Amnesia ~ CMD";
                    break;
                case 2:
                    Console.Title = "Amnesia ~ Powershell";
                    break;
                default:
                    Console.Title = "Amnesia ~ Menu";
                    break;
            }
        }

        static void specialCommands()
        {
            switch(command)
            {
                case "cls":
                case "clear":
                    Console.Clear();
                    break;
                case "history":
                    readHistory();
                    break;
                case "exit":
                    Environment.Exit(0);
                    break;
                case "history -c":
                    history.Clear();
                    break;

            }
        }
        static void readHistory()
        {
            foreach(string item in history)
            {
                Console.WriteLine(item);
            }
        }

    }
}
