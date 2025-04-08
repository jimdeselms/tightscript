/**
 * A machine is a function that takes state as an input and modifies it.
 * 
 * A machine can be halted, meaning that it doesn't have any more work to do. It's up to the host environment to know when it makes to
 * run the machine again.
 * 
 * Here are the rules:
 * 
 * 1) The host environment may manipulate state when the machine is in a HALTED state only.
 *    * You may for debugging purposes.
 * 2) When the machine is in a running state, the host environment will run each step of the machine until it halts. It can run the steps of the machine immediately
 * one after the other, or it can schedule it so that other machines may run in parallel.
 * @returns {boolean} - Returns true if the machine is still running, false if halted.
 */
export type Machine<TBefore, TAfter> = (state: TBefore & TAfter) => boolean