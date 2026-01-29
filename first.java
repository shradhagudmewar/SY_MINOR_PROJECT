import java.util.Scanner;

public class Addition {
    public static void main(String[] args) {

        int num1, num2, sum;

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter first number: ");
        num1 = sc.nextInt();

        System.out.print("Enter second number: ");
        num2 = sc.nextInt();

        sum = num1 + num2;

        System.out.println("Addition of two numbers = " + sum);
    }
}
